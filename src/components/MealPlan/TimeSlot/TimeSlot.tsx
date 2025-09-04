import * as React from "react";
import { Text } from "@fluentui/react-components";
import { useDroppable } from "@dnd-kit/core";

import { useTimeSlotStyles } from "./TimeSlot.styles";
import type { TimeSlotProps } from "./TimeSlot.types";
import { MealItem as MealItemComponent } from "../components/MealItem";

import { formatTimeForDisplay } from "../../../utils/timeSlots";

export const TimeSlot: React.FC<TimeSlotProps> = ({
  date,
  time,
  meals,
  onRemoveMeal,
  showTimeLabel = true,
}) => {
  const styles = useTimeSlotStyles();
  
  const { isOver, setNodeRef } = useDroppable({
    id: `${date}-${time}`,
    data: {
      date,
      time,
      type: "timeSlot",
    },
  });

  const containerClass = `${styles.container} ${isOver ? styles.isDraggingOver : ""}`;

  return (
    <div ref={setNodeRef} className={containerClass}>
      {showTimeLabel && (
        <Text className={styles.timeLabel}>
          {formatTimeForDisplay(time)}
        </Text>
      )}
      
      {meals.length === 0 ? (
        <div className={styles.empty}>
          <Text>Drop recipe here</Text>
        </div>
      ) : (
        <div className={styles.mealsList}>
          {meals.map((meal, index) => (
            <MealItemComponent
              key={`${meal.recipeId}-${index}`}
              meal={meal}
              mealIndex={index}
              onRemove={onRemoveMeal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;