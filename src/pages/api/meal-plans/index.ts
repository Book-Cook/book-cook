import { ObjectId, type Document, type UpdateFilter } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import type { UpdateMealPlanPayload } from "src/clientToServer/types";
import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

const ALLOWED_METHODS = ["GET", "POST", "PUT"];

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Start date and end date are required" 
      });
    }

    const db = await getDb();
    
    const mealPlans = await db
      .collection("mealPlans")
      .find({
        userId,
        date: {
          $gte: startDate as string,
          $lte: endDate as string,
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
        meals.timeSlots.forEach((slot: unknown) => {
          const timeSlot = slot as Record<string, unknown>;
          if (timeSlot.meals && Array.isArray(timeSlot.meals)) {
            timeSlot.meals.forEach((meal: unknown) => {
              const mealData = meal as Record<string, unknown>;
              if (mealData?.recipeId) {
                recipeIds.add(mealData.recipeId as string);
              }
            });
          }
        });
      }
      
      // Handle legacy meal types
      Object.values(meals).forEach((meal: unknown) => {
        if (meal && typeof meal === 'object' && !Array.isArray(meal)) {
          const mealData = meal as Record<string, unknown>;
          if (mealData?.recipeId) {
            recipeIds.add(mealData.recipeId as string);
          }
        }
      });
    });

    // Fetch all recipes in one query
    const recipes = await db
      .collection("recipes")
      .find({
        _id: { $in: Array.from(recipeIds).map(id => new ObjectId(id)) }
      })
      .project({ title: 1, emoji: 1, imageURL: 1, tags: 1 })
      .toArray();

    // Create a recipe map for quick lookup
    const recipeMap = new Map(
      recipes.map(r => [r._id.toString(), r])
    );

    // Enhance meal plans with recipe data
    const enhancedMealPlans = mealPlans.map(plan => {
      const meals = plan.meals ?? {};
      const enhancedMeals: Record<string, unknown> = {};
      
      // Handle timeSlots structure
      if (meals.timeSlots && Array.isArray(meals.timeSlots)) {
        enhancedMeals.timeSlots = meals.timeSlots.map((slot: unknown) => {
          const timeSlot = slot as Record<string, unknown>;
          if (timeSlot.meals && Array.isArray(timeSlot.meals)) {
            return {
              ...timeSlot,
              meals: timeSlot.meals.map((meal: unknown) => {
                const mealData = meal as Record<string, unknown>;
                if (mealData?.recipeId) {
                  return {
                    ...mealData,
                    recipe: recipeMap.get(mealData.recipeId as string) ?? null
                  };
                }
                return mealData;
              })
            };
          }
          return timeSlot;
        });
      }
      
      // Handle legacy meal types
      Object.entries(meals).forEach(([mealType, meal]) => {
        if (mealType !== 'timeSlots' && meal && typeof meal === 'object' && !Array.isArray(meal)) {
          const mealData = meal as Record<string, unknown>;
          if (mealData?.recipeId) {
            enhancedMeals[mealType] = {
              ...mealData,
              recipe: recipeMap.get(mealData.recipeId as string) ?? null
            };
          } else {
            enhancedMeals[mealType] = mealData;
          }
        }
      });
      
      return {
        ...plan,
        meals: enhancedMeals
      };
    });

    res.status(200).json({
      mealPlans: enhancedMealPlans,
      totalCount: enhancedMealPlans.length,
    });
  } catch (error) {
    console.error("Failed to fetch meal plans:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { date, time, mealType, recipeId, servings = 1, duration = 60 } = req.body;

    // Support both new time-based and legacy meal-type-based APIs
    if (!date || !recipeId || (!time && !mealType)) {
      return res.status(400).json({ 
        message: "Date, time (or mealType), and recipe ID are required" 
      });
    }

    const db = await getDb();
    
    // Check if meal plan exists for this date
    const existingPlan = await db
      .collection("mealPlans")
      .findOne({ userId, date });

    // Handle time-based system
    if (time) {
      const mealData = { recipeId, servings, time, duration };
      
      if (existingPlan) {
        // Check if we already have timeSlots or need to migrate from legacy
        const currentMeals = existingPlan.meals ?? {};
        
        currentMeals.timeSlots ??= [];
        
        // Find existing time slot or create new one
        const existingTimeSlotIndex = currentMeals.timeSlots.findIndex(
          (slot: Record<string, unknown>) => slot.time === time
        );
        
        if (existingTimeSlotIndex >= 0) {
          // Add to existing time slot
          const addToExistingSlot = {
            $push: {
              [`meals.timeSlots.${existingTimeSlotIndex}.meals`]: mealData,
            },
            $set: { updatedAt: new Date() },
          } as unknown as UpdateFilter<Document>;
          await db.collection("mealPlans").updateOne(
            { userId, date },
            addToExistingSlot
          );
        } else {
          // Create new time slot
          const createTimeSlotUpdate = {
            $push: {
              "meals.timeSlots": {
                time,
                meals: [mealData],
              },
            },
            $set: { updatedAt: new Date() },
          } as unknown as UpdateFilter<Document>;
          await db.collection("mealPlans").updateOne(
            { userId, date },
            createTimeSlotUpdate
          );
        }
      } else {
        // Create new plan with time-based structure
        await db.collection("mealPlans").insertOne({
          userId,
          date,
          meals: {
            timeSlots: [{
              time,
              meals: [mealData]
            }]
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } else if (mealType) {
      // Legacy meal-type system (backward compatibility)
      const mealData = { recipeId, servings };
      
      if (existingPlan) {
        await db.collection("mealPlans").updateOne(
          { userId, date },
          {
            $set: {
              [`meals.${mealType}`]: mealData,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        await db.collection("mealPlans").insertOne({
          userId,
          date,
          meals: {
            [mealType]: mealData,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    res.status(201).json({ 
      message: "Meal plan updated successfully" 
    });
  } catch (error) {
    console.error("Failed to update meal plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { date, meals, notes } = req.body as UpdateMealPlanPayload;

    if (!date) {
      return res.status(400).json({ 
        message: "Date is required" 
      });
    }

    const db = await getDb();
    
    await db.collection("mealPlans").replaceOne(
      { userId, date },
      {
        userId,
        date,
        meals: meals || {},
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    res.status(200).json({ 
      message: "Meal plan updated successfully" 
    });
  } catch (error) {
    console.error("Failed to update meal plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    return res.status(405).json({ 
      message: `Method ${req.method} not allowed` 
    });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ 
      message: "Unauthorized. Please log in." 
    });
  }

  switch (req.method) {
    case "GET":
      return handleGet(req, res, session.user.id);
    case "POST":
      return handlePost(req, res, session.user.id);
    case "PUT":
      return handlePut(req, res, session.user.id);
    default:
      return res.status(405).json({ 
        message: "Method not allowed" 
      });
  }
}
