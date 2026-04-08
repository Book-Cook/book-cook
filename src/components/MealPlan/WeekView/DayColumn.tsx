import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { clsx } from "clsx";

import { HOUR_HEIGHT, HOURS, MIN_HOUR, getTimePosition } from "./constants";
import styles from "./DayColumn.module.css";
import { MealCard } from "./MealCard";

import type { MealItem } from "../../../clientToServer/types";

interface DayColumnProps {
  date: string;
  meals: Array<{
    time: string;
    meals: Array<MealItem & { recipe?: Record<string, unknown> }>;
  }>;
  onRemoveMeal: (time: string, mealIndex: number) => void;
  isPast?: boolean;
}

interface DropZoneProps {
  date: string;
  hour: number;
  isActive: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ date, hour, isActive }) => {
  const time = `${hour.toString().padStart(2, "0")}:00`;

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${date}-${time}`,
    data: {
      date,
      time,
      type: "time-slot",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        styles.dropZone,
        (isOver || isActive) && styles.dropZoneActive,
      )}
      style={{
        top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px`,
        height: `${HOUR_HEIGHT}px`,
        zIndex: isOver ? 1 : 0,
      }}
    />
  );
};

export const DayColumn: React.FC<DayColumnProps> = React.memo(
  ({ date, meals, onRemoveMeal, isPast = false }) => {
    const [activeDropHour, _setActiveDropHour] = React.useState<number | null>(
      null,
    );

    // Flatten meals for display
    const allMeals = React.useMemo(() => {
      const flattened: Array<{
        id: string;
        meal: MealItem & { recipe?: Record<string, unknown> };
        time: string;
        index: number;
      }> = [];

      meals.forEach((timeSlot) => {
        timeSlot.meals.forEach((meal, index) => {
          flattened.push({
            id: `${date}-${timeSlot.time}-${index}`,
            meal,
            time: timeSlot.time,
            index,
          });
        });
      });

      return flattened;
    }, [meals, date]);

    return (
      <div
        className={styles.column}
        data-day={date}
        style={{ opacity: isPast ? 0.6 : 1 }}
      >
        {/* Hour grid lines */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className={styles.hourSlot}
            style={{
              top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px`,
              height: `${HOUR_HEIGHT}px`,
            }}
          />
        ))}

        {/* Drop zones for each hour */}
        {HOURS.map((hour) => (
          <DropZone
            key={`drop-${hour}`}
            date={date}
            hour={hour}
            isActive={activeDropHour === hour}
          />
        ))}

        {/* Sortable meal cards */}
        <SortableContext
          items={allMeals.map((meal) => meal.id)}
          strategy={verticalListSortingStrategy}
        >
          {allMeals.map(({ id, meal, time, index }) => {
            const recipe = meal.recipe as
              | { title?: string; emoji?: string }
              | undefined;

            return (
              <MealCard
                key={id}
                id={id}
                recipeId={meal.recipeId}
                title={recipe?.title ?? "Unknown Recipe"}
                emoji={recipe?.emoji}
                time={time}
                duration={meal.duration ?? 60}
                position={getTimePosition(time)}
                onRemove={() => onRemoveMeal(time, index)}
                date={date}
                mealIndex={index}
              />
            );
          })}
        </SortableContext>
      </div>
    );
  },
);

DayColumn.displayName = "DayColumn";
