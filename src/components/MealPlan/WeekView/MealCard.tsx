import * as React from "react";
import { Text, makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { Button } from "../../Button";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  card: {
    position: "absolute",
    left: tokens.spacingHorizontalXS,
    right: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXS),
    transition: "all 0.2s ease",
    zIndex: 2,
    userSelect: "none",
    cursor: "pointer",
    boxShadow: tokens.shadow2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: tokens.shadow4,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
  },
  
  
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
  
  content: {
    display: "flex",
    alignItems: "flex-start",
    ...shorthands.gap(tokens.spacingHorizontalXS),
    flex: 1,
    minWidth: 0,
  },
  
  emoji: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: 1,
    flexShrink: 0,
  },
  
  title: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase200,
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  },
  
  removeButton: {
    minWidth: "20px",
    minHeight: "20px",
    ...shorthands.padding(0),
    flexShrink: 0,
  },
  
  
});

export interface MealCardProps {
  id: string;
  recipeId: string;
  title: string;
  emoji?: string;
  time: string;
  duration: number;
  position: number;
  onRemove: () => void;
  date: string;
  mealIndex: number;
}

export const MealCard: React.FC<MealCardProps> = React.memo(({
  id,
  recipeId,
  title,
  emoji,
  duration,
  position,
  onRemove,
}) => {
  const styles = useStyles();
  const router = useRouter();
  
  const handleCardClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipeId) {
      await router.push(`/recipes/${recipeId}`);
    }
  };

  const cardHeight = Math.max(30, (duration / 60) * 60 - 8);
  
  const style: React.CSSProperties = {
    top: `${position}px`,
    height: `${cardHeight}px`,
  };
  
  return (
    <div
      className={styles.card}
      style={style}
      data-meal-id={id}
      onClick={handleCardClick}
    >
      <div className={styles.header}>
        <div className={styles.content}>
          <Text className={styles.emoji}>{emoji ?? '🍽️'}</Text>
          <Text className={styles.title} title={title}>{title}</Text>
        </div>
        <Button
          appearance="subtle"
          icon={<Dismiss12Regular />}
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove meal"
        />
      </div>
    </div>
  );
});

MealCard.displayName = 'MealCard';