import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

import type {
  MealItem,
  MealPlan,
  MealPlanWithRecipes,
  TimeSlot,
} from "../../../clientToServer/types";
import {
  generateICalContent,
  mealPlansToICalEvents,
} from "../../../components/MealPlan/utils/icalGenerator";

type LegacyMealKey = Exclude<keyof MealPlanWithRecipes["meals"], "timeSlots">;
type MealPlanDocument = MealPlan & { _id: ObjectId };
type RecipeDocument = {
  _id: ObjectId;
  title?: string;
  emoji?: string;
  imageURL?: string;
};

const isMealItem = (meal: unknown): meal is MealItem =>
  typeof meal === "object" &&
  meal !== null &&
  "recipeId" in (meal as Record<string, unknown>);

/**
 * Validate calendar token and get user ID
 */
async function getUserIdFromToken(token: string): Promise<string | null> {
  if (!token) {
    return null;
  }

  const db = await getDb();
  const user = await db
    .collection<{ _id: ObjectId; calendarToken?: string }>("users")
    .findOne({ calendarToken: token });

  return user?._id.toString() ?? null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { token, range = "30" } = req.query;

    let userId: string | null = null;

    // Handle token-based access (for calendar subscriptions)
    if (token && typeof token === "string") {
      userId = await getUserIdFromToken(token);
      if (!userId) {
        return res.status(401).json({
          message: "Invalid calendar token",
        });
      }
    } else {
      // Handle session-based access (for authenticated users)
      const session: Session | null = await getServerSession(
        req,
        res,
        authOptions
      );

      if (!session?.user?.id) {
        return res.status(401).json({
          message: "Unauthorized. Please log in or provide a valid token.",
        });
      }

      userId = session.user.id;
    }

    // Calculate date range (default: next 30 days)
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(
      Date.now() + parseInt(range as string) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const db = await getDb();
    const mealPlansCollection = db.collection<MealPlanDocument>("mealPlans");

    // Fetch meal plans for the date range
    const mealPlans = await mealPlansCollection
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
    mealPlans.forEach((plan) => {
      const meals = plan.meals ?? {};

      // Handle timeSlots structure
      if (meals.timeSlots) {
        meals.timeSlots.forEach((slot) => {
          slot.meals.forEach((meal) => {
            if (meal.recipeId) {
              recipeIds.add(meal.recipeId);
            }
          });
        });
      }

      // Handle legacy meal types
      const { timeSlots: _timeSlots, ...legacyMeals } = meals;
      Object.values(legacyMeals).forEach((meal) => {
        if (isMealItem(meal) && meal.recipeId) {
          recipeIds.add(meal.recipeId);
        }
      });
    });

    // Fetch all recipes in one query
    const recipes = await db
      .collection<RecipeDocument>("recipes")
      .find({
        _id: { $in: Array.from(recipeIds).map((id) => new ObjectId(id)) },
      })
      .project<RecipeDocument>({ title: 1, emoji: 1, imageURL: 1 })
      .toArray();

    // Create a recipe map for quick lookup
    const recipeMap = new Map<string, RecipeDocument>(
      recipes.map((r) => [r._id.toString(), r])
    );

    // Enhance meal plans with recipe data
    const enhancedMealPlans: MealPlanWithRecipes[] = mealPlans.map((plan) => {
      const meals = plan.meals ?? {};
      const enhancedMeals: MealPlanWithRecipes["meals"] = {};

      if (meals.timeSlots) {
        enhancedMeals.timeSlots = meals.timeSlots.map((slot: TimeSlot) => ({
          ...slot,
          meals: slot.meals.map((meal: MealItem) => ({
            ...meal,
            ...(meal.recipeId
              ? { recipe: recipeMap.get(meal.recipeId) }
              : {}),
          })),
        }));
      }

      const { timeSlots: _timeSlots, ...legacyMeals } = meals;
      Object.entries(legacyMeals).forEach(([mealType, meal]) => {
        if (isMealItem(meal)) {
          const key = mealType as LegacyMealKey;
          enhancedMeals[key] = {
            ...meal,
            ...(meal.recipeId
              ? { recipe: recipeMap.get(meal.recipeId) }
              : {}),
          } as MealPlanWithRecipes["meals"][LegacyMealKey];
        }
      });

      return {
        _id: plan._id.toString(),
        userId: plan.userId,
        date: plan.date,
        meals: enhancedMeals,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      };
    });

    // Generate iCal events
    const events = mealPlansToICalEvents(enhancedMealPlans);
    const iCalContent = generateICalContent(events, "Book Cook Meal Plan");

    // Set proper headers for iCal content
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="meal-plan.ics"'
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.status(200).send(iCalContent);
  } catch (error) {
    console.error("Failed to generate calendar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
