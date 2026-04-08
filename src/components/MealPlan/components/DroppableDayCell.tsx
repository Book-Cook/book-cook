/**
 * Droppable day cell component for MonthView
 */
import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { XIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { useRouter } from "next/router";

import type { DroppableDayCellProps } from "./DroppableDayCell.types";
import styles from "./MonthDayCell.module.css";
import { formatDateString } from "../utils/formatDateString";

import type { MealType } from "../../../clientToServer/types";
import { mealTypeToTime } from "../../../utils/timeSlots";
import { Button } from "../../Button";
import { Text } from "../../Text";

export const DroppableDayCell: React.FC<DroppableDayCellProps> = ({
  date,
  isToday,
  isCurrentMonth,
  isPast,
  mealPlan,
  children,
  onMealRemove,
}) => {
  const router = useRouter();
  const dateStr = formatDateString(date);

  const { isOver, setNodeRef } = useDroppable({
    id: `month-day-${dateStr}`,
    data: {
      date: dateStr,
      type: "month-day",
    },
  });

  const handleMealClick = (recipeId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".meal-remove-button")) {
      event.stopPropagation();
      return;
    }
    void router.push(`/recipes/${recipeId}`);
  };

  const handleRemoveClick = (
    date: string,
    time: string,
    mealIndex: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    void onMealRemove(date, time, mealIndex);
  };

  const cellClass = clsx(
    styles.dayCell,
    !isCurrentMonth && styles.otherMonth,
    isPast && styles.pastDay,
    isToday && styles.isToday,
    isOver && styles.isDraggingOver,
  );

  const headerClass = clsx(styles.dayHeader, isPast && styles.pastDayHeader);

  return (
    <div ref={setNodeRef} className={cellClass}>
      <div className={headerClass}>
        {isToday ? (
          <div className={styles.isTodayNumber}>{date.getDate()}</div>
        ) : (
          <Text
            className={clsx(styles.dayNumber, isToday && styles.isTodayText)}
          >
            {date.getDate()}
          </Text>
        )}
      </div>

      <div className={styles.mealIndicators}>
        {/* Show time-based meals if available */}
        {mealPlan?.meals?.timeSlots && Array.isArray(mealPlan.meals.timeSlots)
          ? // Sort time slots by time first, then flatten
            mealPlan.meals.timeSlots
              .sort((a, b) => a.time.localeCompare(b.time))
              .flatMap((slot, slotIndex) => {
                if (!slot.meals || slot.meals.length === 0) {
                  return [];
                }

                // Show each meal in the time slot
                return slot.meals.map((meal, mealIndex) => (
                  <div
                    key={`${slot.time}-${slotIndex}-${mealIndex}`}
                    className={styles.mealIndicator}
                    title={`${slot.time}: ${(meal.recipe?.title as string) ?? "Recipe"} - Click to view`}
                    onClick={(e) => handleMealClick(meal.recipeId, e)}
                  >
                    <div className={styles.mealContent}>
                      <span className={styles.mealEmoji}>
                        {(meal.recipe?.emoji as string) ?? "🍽️"}
                      </span>
                      <span className={styles.mealTitle}>
                        {(meal.recipe?.title as string) ?? "Meal"}
                      </span>
                    </div>
                    <Button
                      appearance="subtle"
                      className={clsx(
                        styles.removeButton,
                        "meal-remove-button",
                      )}
                      startIcon={<XIcon size={8} />}
                      onClick={(e) =>
                        handleRemoveClick(dateStr, slot.time, mealIndex, e)
                      }
                      title="Remove meal"
                    />
                  </div>
                ));
              })
          : /* Fall back to legacy meal types */
            ["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
              const meal = mealPlan?.meals?.[mealType as MealType];
              if (!meal) {
                return null;
              }

              return (
                <div
                  key={mealType}
                  className={styles.mealIndicator}
                  title={`${mealType}: ${(meal.recipe?.title as string) ?? "Recipe"} - Click to view`}
                  onClick={(e) => handleMealClick(meal.recipeId, e)}
                >
                  <div className={styles.mealContent}>
                    <span className={styles.mealEmoji}>
                      {(meal.recipe?.emoji as string) ?? "🍽️"}
                    </span>
                    <span className={styles.mealTitle}>
                      {(meal.recipe?.title as string) ?? mealType}
                    </span>
                  </div>
                  <Button
                    appearance="subtle"
                    className={clsx(styles.removeButton, "meal-remove-button")}
                    startIcon={<XIcon size={8} />}
                    onClick={(e) =>
                      handleRemoveClick(dateStr, mealTypeToTime(mealType), 0, e)
                    }
                    title="Remove meal"
                  />
                </div>
              );
            })}
      </div>
      {children}
    </div>
  );
};
