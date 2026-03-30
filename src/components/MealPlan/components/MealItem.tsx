/**
 * Individual meal item component for time slots
 */
import * as React from "react";
import { XIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { useRouter } from "next/router";

import type { MealItemProps } from "./MealItem.types";
import styles from "../TimeSlot/TimeSlot.module.css";

import { Button } from "../../Button";
import { Text } from "../../Text";

export const MealItem: React.FC<MealItemProps> = ({
  meal,
  mealIndex,
  onRemove,
}) => {
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
      className={clsx(styles.mealItem, styles.mealItemHover)}
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
            {meal.servings} serving{meal.servings > 1 ? "s" : ""}
          </Text>
        )}
      </div>
      <Button
        appearance="subtle"
        className={clsx(styles.removeButton, "meal-remove-button")}
        startIcon={<XIcon size={12} />}
        onClick={handleRemoveClick}
        title="Remove meal"
      />
    </div>
  );
};
