import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
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
    const { date, time, mealIndex } = req.query;

    if (!date || !time || mealIndex === undefined) {
      return res.status(400).json({ 
        message: "Date, time, and meal index are required" 
      });
    }

    const mealIndexNum = parseInt(mealIndex as string, 10);
    if (isNaN(mealIndexNum) || mealIndexNum < 0) {
      return res.status(400).json({ 
        message: "Invalid meal index" 
      });
    }

    const db = await getDb();
    
    // Find the meal plan
    const mealPlan = await db.collection("mealPlans").findOne({ 
      userId: session.user.id, 
      date: date as string 
    });

    if (!mealPlan) {
      return res.status(404).json({ 
        message: "Meal plan not found" 
      });
    }

    // Find the time slot
    const timeSlots = mealPlan.meals?.timeSlots ?? [];
    const timeSlotIndex = timeSlots.findIndex((slot: Record<string, unknown>) => slot.time === time);

    if (timeSlotIndex === -1) {
      return res.status(404).json({ 
        message: "Time slot not found" 
      });
    }

    const timeSlot = timeSlots[timeSlotIndex];
    if (!timeSlot.meals || mealIndexNum >= timeSlot.meals.length) {
      return res.status(404).json({ 
        message: "Meal not found" 
      });
    }

    // Remove the meal from the time slot
    if (timeSlot.meals.length === 1) {
      // Remove the entire time slot if it's the only meal
      await db.collection("mealPlans").updateOne(
        { 
          userId: session.user.id, 
          date: date as string 
        },
        {
          $pull: { "meals.timeSlots": { time: time as string } } as any,
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      // Remove just the specific meal
      await db.collection("mealPlans").updateOne(
        { 
          userId: session.user.id, 
          date: date as string 
        },
        {
          $unset: { [`meals.timeSlots.${timeSlotIndex}.meals.${mealIndexNum}`]: "" },
          $set: { updatedAt: new Date() },
        }
      );

      // Clean up the array (remove null elements)
      await db.collection("mealPlans").updateOne(
        { 
          userId: session.user.id, 
          date: date as string 
        },
        {
          $pull: { [`meals.timeSlots.${timeSlotIndex}.meals`]: null } as any,
        }
      );
    }

    res.status(200).json({ 
      message: "Meal removed successfully" 
    });
  } catch (error) {
    console.error("Failed to delete meal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}