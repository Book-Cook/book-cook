import * as React from "react";
import { clsx } from "clsx";

import styles from "./HourlyDayView.module.css";
import { TimeSlot } from "../TimeSlot/TimeSlot";
import { formatDateString } from "../utils/formatDateString";

import type {
  MealItem,
  MealPlanWithRecipes,
} from "../../../clientToServer/types";
import {
  DEFAULT_TIME_CONFIG,
  generateTimeSlots,
  mealTypeToTime,
} from "../../../utils/timeSlots";
import { Text } from "../../Text";

interface HourlyDayViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (
    date: string,
    time: string,
    mealIndex: number,
  ) => Promise<void>;
}

export const HourlyDayView: React.FC<HourlyDayViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const dateStr = formatDateString(currentDate);
  const timeSlots = generateTimeSlots(DEFAULT_TIME_CONFIG);

  // Get meal plan for current date
  const dayPlan = mealPlans.find((plan) => plan.date === dateStr);

  // Get all meals for the day, organized by time
  const getAllMealsOrganized = (): Map<
    string,
    Array<MealItem & { recipe?: Record<string, unknown> }>
  > => {
    const mealsByTime = new Map<
      string,
      Array<MealItem & { recipe?: Record<string, unknown> }>
    >();

    if (!dayPlan) {
      return mealsByTime;
    }

    // Add time-based slots
    if (dayPlan.meals.timeSlots && Array.isArray(dayPlan.meals.timeSlots)) {
      dayPlan.meals.timeSlots.forEach((slot) => {
        if (slot.time && slot.meals) {
          mealsByTime.set(slot.time, slot.meals);
        }
      });
    }

    // Add legacy meal types at their default times
    const legacyMealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

    legacyMealTypes.forEach((mealType) => {
      const meal = dayPlan.meals[mealType as keyof typeof dayPlan.meals];
      if (
        meal &&
        typeof meal === "object" &&
        "recipeId" in meal &&
        "servings" in meal
      ) {
        const defaultTime = mealTypeToTime(mealType);
        // Only add if we don't already have a meal at this time from timeSlots
        if (!mealsByTime.has(defaultTime)) {
          mealsByTime.set(defaultTime, [
            {
              ...meal,
              time: defaultTime,
            } as MealItem & { recipe?: Record<string, unknown> },
          ]);
        }
      }
    });

    return mealsByTime;
  };

  const allMeals = getAllMealsOrganized();

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.dateTitle}>
          {formatDateHeader(currentDate)}
        </Text>
      </div>

      <div className={styles.timeGrid}>
        {timeSlots.map((time) => {
          const meals = allMeals.get(time) ?? [];

          // Check if this time has passed
          const now = new Date();
          const [hours, minutes] = time.split(":").map(Number);
          const timeDate = new Date(currentDate);
          timeDate.setHours(hours, minutes, 0, 0);
          const isPast = timeDate < now;

          return (
            <React.Fragment key={time}>
              <div
                className={clsx(
                  styles.timeLabel,
                  isPast && styles.pastTimeLabel,
                )}
              >
                {time}
              </div>
              <div
                className={clsx(
                  styles.timeSlotContainer,
                  isPast && styles.pastTime,
                )}
              >
                <TimeSlot
                  date={dateStr}
                  time={time}
                  meals={meals}
                  onRemoveMeal={async (mealIndex) => {
                    await onMealRemove(dateStr, time, mealIndex);
                  }}
                  showTimeLabel={false}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
