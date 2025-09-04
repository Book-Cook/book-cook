/**
 * Individual meal item component for time slots
 */
import * as React from "react";
import { Text, Button, mergeClasses } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";

import type { MealItemProps } from "./MealItem.types";
import { useTimeSlotStyles } from "../TimeSlot/TimeSlot.styles";

export const MealItem: React.FC<MealItemProps> = ({ meal, mealIndex, onRemove }) => {
  const styles = useTimeSlotStyles();
  const router = useRouter();

  const handleMealClick = () => {
    void router.push(`/recipes/${meal.recipeId}`);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(mealIndex);
  };

  return (
    <div
      className={mergeClasses(styles.mealItem, styles.mealItemHover)}
      onClick={handleMealClick}
      title={`${(meal.recipe?.title as string) ?? "Recipe"} - Click to view recipe`}
    >
      <div className={styles.emoji}>
        {(meal.recipe?.emoji as string) ?? "🍽️"}
      </div>
      <div className={styles.mealContent}>
        <Text className={styles.title}>
          {(meal.recipe?.title as string) ?? "Recipe"}
        </Text>
        {meal.servings && meal.servings > 1 && (
          <Text className={styles.servings}>
            {meal.servings} serving{meal.servings > 1 ? 's' : ''}
          </Text>
        )}
      </div>
      <Button
        appearance="subtle"
        className={mergeClasses(styles.removeButton, "meal-remove-button")}
        icon={<Dismiss12Regular />}
        onClick={handleRemoveClick}
        title="Remove meal"
      />
    </div>
  );
};