import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";


import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

import { generateICalContent, mealPlansToICalEvents } from "../../../components/MealPlan/utils/icalGenerator";
import crypto from "crypto";

/**
 * Validate calendar token and get user ID
 */
async function getUserIdFromToken(token: string): Promise<string | null> {
  if (!token) {return null;}
  
  const db = await getDb();
  const user = await db.collection("users").findOne({ calendarToken: token });
  
  return user?._id.toString() || null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ 
      message: "Method not allowed" 
    });
  }

  try {
    const { token, range = '30' } = req.query;

    let userId: string | null = null;

    // Handle token-based access (for calendar subscriptions)
    if (token && typeof token === 'string') {
      userId = await getUserIdFromToken(token);
      if (!userId) {
        return res.status(401).json({ 
          message: "Invalid calendar token" 
        });
      }
    } else {
      // Handle session-based access (for authenticated users)
      const session: Session | null = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.id) {
        return res.status(401).json({ 
          message: "Unauthorized. Please log in or provide a valid token." 
        });
      }
      
      userId = session.user.id;
    }

    // Calculate date range (default: next 30 days)
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + parseInt(range as string) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const db = await getDb();
    
    // Fetch meal plans for the date range
    const mealPlans = await db
      .collection("mealPlans")
      .find({
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .toArray();

    // Get all unique recipe IDs
    const recipeIds = new Set<string>();
    mealPlans.forEach(plan => {
      const meals = plan.meals ?? {};
      
      // Handle timeSlots structure
      if (meals.timeSlots && Array.isArray(meals.timeSlots)) {
        meals.timeSlots.forEach((slot: any) => {
          if (slot.meals && Array.isArray(slot.meals)) {
            slot.meals.forEach((meal: any) => {
              if (meal?.recipeId) {
                recipeIds.add(meal.recipeId);
              }
            });
          }
        });
      }
      
      // Handle legacy meal types
      Object.values(meals).forEach((meal: any) => {
        if (meal && typeof meal === 'object' && !Array.isArray(meal) && meal?.recipeId) {
          recipeIds.add(meal.recipeId);
        }
      });
    });

    // Fetch all recipes in one query
    const recipes = await db
      .collection("recipes")
      .find({
        _id: { $in: Array.from(recipeIds).map(id => new ObjectId(id)) }
      })
      .project({ title: 1, emoji: 1, imageURL: 1 })
      .toArray();

    // Create a recipe map for quick lookup
    const recipeMap = new Map(
      recipes.map(r => [r._id.toString(), r])
    );

    // Enhance meal plans with recipe data
    const enhancedMealPlans = mealPlans.map(plan => {
      const meals = plan.meals ?? {};
      const enhancedMeals: any = {};
      
      // Handle timeSlots structure
      if (meals.timeSlots && Array.isArray(meals.timeSlots)) {
        enhancedMeals.timeSlots = meals.timeSlots.map((slot: any) => {
          if (slot.meals && Array.isArray(slot.meals)) {
            return {
              ...slot,
              meals: slot.meals.map((meal: any) => {
                if (meal?.recipeId) {
                  return {
                    ...meal,
                    recipe: recipeMap.get(meal.recipeId) || null
                  };
                }
                return meal;
              })
            };
          }
          return slot;
        });
      }
      
      // Handle legacy meal types
      Object.entries(meals).forEach(([mealType, meal]) => {
        if (mealType !== 'timeSlots' && meal && typeof meal === 'object' && !Array.isArray(meal)) {
          const mealData = meal as any;
          if (mealData?.recipeId) {
            enhancedMeals[mealType] = {
              ...mealData,
              recipe: recipeMap.get(mealData.recipeId) || null
            };
          } else {
            enhancedMeals[mealType] = mealData;
          }
        }
      });
      
      return {
        _id: plan._id.toString(),
        userId: (plan as any).userId ?? '',
        date: (plan as any).date ?? '',
        meals: enhancedMeals,
        createdAt: (plan as any).createdAt ?? new Date(),
        updatedAt: (plan as any).updatedAt ?? new Date()
      };
    });

    // Generate iCal events
    const events = mealPlansToICalEvents(enhancedMealPlans);
    const iCalContent = generateICalContent(events, 'Book Cook Meal Plan');

    // Set proper headers for iCal content
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="meal-plan.ics"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    res.status(200).send(iCalContent);

  } catch (error) {
    console.error("Failed to generate calendar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}