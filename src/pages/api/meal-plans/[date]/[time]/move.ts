import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { getDb } from "../../../../../utils/db";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { date, time } = req.query;
    const { mealIndex, targetDate, targetTime } = req.body;

    if (!date || !time || typeof mealIndex !== "number" || !targetDate || !targetTime) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const db = await getDb();
    const mealPlansCollection = db.collection("mealPlans");

    // Find the source meal plan
    const sourceMealPlan = await mealPlansCollection.findOne({
      userId: session.user.id,
      date: date as string,
    });

    if (!sourceMealPlan) {
      return res.status(404).json({ message: "Source meal plan not found" });
    }

    // Find the source time slot
    const timeSlots = sourceMealPlan.meals?.timeSlots ?? [];
    const sourceSlotIndex = timeSlots.findIndex((slot: { time: string }) => slot.time === time);

    if (sourceSlotIndex === -1) {
      return res.status(404).json({ message: "Source time slot not found" });
    }

    const sourceSlot = timeSlots[sourceSlotIndex];
    if (!sourceSlot.meals || mealIndex >= sourceSlot.meals.length) {
      return res.status(400).json({ message: "Invalid meal index" });
    }

    // Get the meal to move
    const mealToMove = sourceSlot.meals[mealIndex];

    // Check if we're moving within the same date
    const isSameDate = date === targetDate;
    
    if (isSameDate) {
      // Handle move within the same date more efficiently
      // Remove from source slot
      sourceSlot.meals.splice(mealIndex, 1);
      
      // Remove source slot if empty
      if (sourceSlot.meals.length === 0) {
        timeSlots.splice(sourceSlotIndex, 1);
      }
      
      // Add to target slot in the same plan
      const targetSlotIndex = timeSlots.findIndex((slot: { time: string }) => slot.time === targetTime);
      
      if (targetSlotIndex >= 0) {
        // Add to existing time slot
        timeSlots[targetSlotIndex].meals.push(mealToMove);
      } else {
        // Create new time slot
        timeSlots.push({
          time: targetTime,
          meals: [mealToMove],
        });
      }
      
      // Sort time slots
      timeSlots.sort((a: { time: string }, b: { time: string }) => a.time.localeCompare(b.time));
      
      // Update the meal plan
      await mealPlansCollection.updateOne(
        { userId: session.user.id, date: date as string },
        {
          $set: {
            "meals.timeSlots": timeSlots,
            updatedAt: new Date(),
          },
        }
      );
      
      return res.status(200).json({ message: "Meal moved successfully" });
    }
    
    // Different dates - handle as before
    // Remove meal from source slot
    sourceSlot.meals.splice(mealIndex, 1);
    
    // If source slot is now empty, remove it
    if (sourceSlot.meals.length === 0) {
      timeSlots.splice(sourceSlotIndex, 1);
    }

    // Update source meal plan
    await mealPlansCollection.updateOne(
      { userId: session.user.id, date: date as string },
      {
        $set: {
          "meals.timeSlots": timeSlots,
          updatedAt: new Date(),
        },
      }
    );

    // Now add to target meal plan
    const targetDateStr = targetDate as string;
    
    // Find or create target meal plan
    let targetMealPlan = await mealPlansCollection.findOne({
      userId: session.user.id,
      date: targetDateStr,
    });

    if (!targetMealPlan) {
      // Create new meal plan for target date
      const newMealPlan = {
        userId: session.user.id,
        date: targetDateStr,
        meals: { timeSlots: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await mealPlansCollection.insertOne(newMealPlan);
      targetMealPlan = { ...newMealPlan, _id: result.insertedId };
    }

    // Add meal to target time slot
    const targetTimeSlots = targetMealPlan.meals?.timeSlots ?? [];
    const targetSlotIndex = targetTimeSlots.findIndex((slot: { time: string }) => slot.time === targetTime);

    if (targetSlotIndex >= 0) {
      // Add to existing time slot
      targetTimeSlots[targetSlotIndex].meals.push(mealToMove);
    } else {
      // Create new time slot
      targetTimeSlots.push({
        time: targetTime,
        meals: [mealToMove],
      });
    }

    // Sort time slots
    targetTimeSlots.sort((a: { time: string }, b: { time: string }) => a.time.localeCompare(b.time));

    // Update target meal plan
    await mealPlansCollection.updateOne(
      { userId: session.user.id, date: targetDateStr },
      {
        $set: {
          "meals.timeSlots": targetTimeSlots,
          updatedAt: new Date(),
        },
      }
    );

    return res.status(200).json({ message: "Meal moved successfully" });
  } catch (error) {
    console.error("Error moving meal:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}