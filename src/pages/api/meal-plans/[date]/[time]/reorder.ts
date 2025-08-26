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
    const { oldIndex, newIndex } = req.body;

    if (!date || !time || typeof oldIndex !== "number" || typeof newIndex !== "number") {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const db = await getDb();
    const mealPlansCollection = db.collection("mealPlans");

    // Find the meal plan for this date
    const mealPlan = await mealPlansCollection.findOne({
      userId: session.user.id,
      date: date as string,
    });

    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    // Find the time slot
    const timeSlots = mealPlan.meals?.timeSlots || [];
    const timeSlotIndex = timeSlots.findIndex((slot: { time: string }) => slot.time === time);

    if (timeSlotIndex === -1) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    const timeSlot = timeSlots[timeSlotIndex];
    if (!timeSlot.meals || oldIndex >= timeSlot.meals.length || newIndex >= timeSlot.meals.length) {
      return res.status(400).json({ message: "Invalid meal index" });
    }

    // Reorder the meals
    const meals = [...timeSlot.meals];
    const [removed] = meals.splice(oldIndex, 1);
    meals.splice(newIndex, 0, removed);

    // Update the time slot
    timeSlots[timeSlotIndex] = { ...timeSlot, meals };

    // Update the meal plan
    const result = await mealPlansCollection.updateOne(
      { userId: session.user.id, date: date as string },
      {
        $set: {
          "meals.timeSlots": timeSlots,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    return res.status(200).json({ message: "Meals reordered successfully" });
  } catch (error) {
    console.error("Error reordering meals:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}