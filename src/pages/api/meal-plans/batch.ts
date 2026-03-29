import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import type { BatchUpdateMealPlanPayload } from "src/clientToServer/types";
import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
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

  try {
    const { updates } = req.body as BatchUpdateMealPlanPayload;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ 
        message: "Updates array is required" 
      });
    }

    const db = await getDb();
    const bulkOps = [];

    for (const update of updates) {
      const { date, mealType, recipeId, servings = 1 } = update;

      if (recipeId === null) {
        // Remove meal
        bulkOps.push({
          updateOne: {
            filter: { userId: session.user.id, date },
            update: {
              $unset: { [`meals.${mealType}`]: "" },
              $set: { updatedAt: new Date() },
            },
          },
        });
      } else {
        // Add or update meal
        bulkOps.push({
          updateOne: {
            filter: { userId: session.user.id, date },
            update: {
              $set: {
                [`meals.${mealType}`]: { recipeId, servings },
                updatedAt: new Date(),
              },
              $setOnInsert: {
                userId: session.user.id,
                createdAt: new Date(),
              },
            },
            upsert: true,
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await db.collection("mealPlans").bulkWrite(bulkOps);
    }

    res.status(200).json({ 
      message: "Meal plans updated successfully",
      updatedCount: bulkOps.length,
    });
  } catch (error) {
    console.error("Failed to batch update meal plans:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}