import * as React from "react";
import { Text } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";

import { useMealCardStyles } from "./MealCard.styles";
import type { MealCardProps } from "./MealCard.types";

import { Button } from "../../Button";

export const MealCard = React.forwardRef<HTMLDivElement, MealCardProps>(
  (
    { id, recipeId, title, emoji, duration, position, onRemove },
    ref
  ): React.ReactElement => {
    const styles = useMealCardStyles();
    const router = useRouter();

    const handleCardClick = React.useCallback(
      async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!recipeId) {
          return;
        }
        await router.push(`/recipes/${recipeId}`);
      },
      [recipeId, router]
    );

    const handleRemoveClick = React.useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        onRemove();
      },
      [onRemove]
    );

    const cardHeight = React.useMemo(
      () => Math.max(30, (duration / 60) * 60 - 8),
      [duration]
    );

    const style = React.useMemo<React.CSSProperties>(
      () => ({
        top: `${position}px`,
        height: `${cardHeight}px`,
      }),
      [cardHeight, position]
    );

    return (
      <div
        ref={ref}
        className={styles.card}
        style={style}
        data-meal-id={id}
        onClick={handleCardClick}
      >
        <div className={styles.header}>
          <div className={styles.content}>
            <Text className={styles.emoji}>{emoji ?? "🍽️"}</Text>
            <Text className={styles.title} title={title}>
              {title}
            </Text>
          </div>
          <Button
            appearance="subtle"
            icon={<Dismiss12Regular />}
            className={styles.removeButton}
            onClick={handleRemoveClick}
            aria-label="Remove meal"
          />
        </div>
      </div>
    );
  }
);

MealCard.displayName = "MealCard";
