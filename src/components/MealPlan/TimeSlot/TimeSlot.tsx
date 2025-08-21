import * as React from "react";
import { Text, Button, makeStyles, tokens } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/router";

import type { MealItem } from "../../../clientToServer/types";
import { formatTimeForDisplay } from "../../../utils/timeSlots";

const useStyles = makeStyles({
  container: {
    minHeight: "80px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingHorizontalS,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    transition: "all 0.2s ease",
    "&:hover": {
      borderTopColor: tokens.colorNeutralStroke1Hover,
      borderRightColor: tokens.colorNeutralStroke1Hover,
      borderBottomColor: tokens.colorNeutralStroke1Hover,
      borderLeftColor: tokens.colorNeutralStroke1Hover,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  isDraggingOver: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    borderTopWidth: "2px",
    borderRightWidth: "2px",
    borderBottomWidth: "2px",
    borderLeftWidth: "2px",
    backgroundColor: tokens.colorBrandBackground2,
  },
  timeLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXS,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontStyle: "italic",
    textAlign: "center",
    flex: 1,
  },
  mealsList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    flex: 1,
  },
  mealItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    position: "relative",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      transform: "translateY(-1px)",
    },
  },
  emoji: {
    fontSize: "18px",
  },
  mealContent: {
    flex: 1,
    overflow: "hidden",
  },
  title: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  servings: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  removeButton: {
    position: "absolute",
    top: "2px",
    right: "2px",
    minWidth: "16px",
    width: "16px",
    height: "16px",
    padding: "0",
    opacity: 0.7,
    "&:hover": {
      opacity: 1,
    },
  },
});

interface TimeSlotProps {
  date: string;
  time: string; // "HH:mm" format
  meals: (MealItem & { recipe?: Record<string, unknown> })[];
  onRemoveMeal: (mealIndex: number) => void;
  showTimeLabel?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  date,
  time,
  meals,
  onRemoveMeal,
  showTimeLabel = true,
}) => {
  const styles = useStyles();
  const router = useRouter();
  
  const { isOver, setNodeRef } = useDroppable({
    id: `${date}-${time}`,
    data: {
      date,
      time,
      type: "timeSlot",
    },
  });

  const containerClass = `${styles.container} ${isOver ? styles.isDraggingOver : ""}`;

  const handleMealClick = (recipeId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking the remove button
    if ((event.target as HTMLElement).closest('button')) {
      event.stopPropagation();
      return;
    }
    void router.push(`/recipes/${recipeId}`);
  };

  const handleRemoveClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onRemoveMeal(index);
  };

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
          {meals.map((meal, index) => {
            const recipe = meal.recipe;
            return (
              <div 
                key={`${meal.recipeId}-${index}`} 
                className={styles.mealItem}
                onClick={(e) => handleMealClick(meal.recipeId, e)}
                title={`Click to view ${(recipe?.title as string) ?? "recipe"}`}
              >
                <span className={styles.emoji}>
                  {(recipe?.emoji as string) || "🍽️"}
                </span>
                <div className={styles.mealContent}>
                  <Text className={styles.title}>
                    {(recipe?.title as string) ?? "Recipe"}
                  </Text>
                  {meal.servings > 1 && (
                    <Text className={styles.servings}>
                      {meal.servings} servings
                    </Text>
                  )}
                </div>
                <Button
                  appearance="subtle"
                  className={styles.removeButton}
                  icon={<Dismiss12Regular />}
                  onClick={(e) => handleRemoveClick(index, e)}
                  title="Remove meal"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};