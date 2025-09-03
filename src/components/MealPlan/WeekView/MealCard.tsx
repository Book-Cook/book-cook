import * as React from "react";
import { Text, Button, makeStyles, tokens, shorthands, mergeClasses } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    cursor: "grab",
    boxShadow: tokens.shadow2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: tokens.shadow4,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
    "&:active": {
      cursor: "grabbing",
    },
  },
  
  dragging: {
    opacity: 0.5,
    zIndex: 999,
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
  title,
  emoji,
  time,
  duration,
  position,
  onRemove,
  date,
  mealIndex,
}) => {
  const styles = useStyles();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "meal-card",
      date,
      time,
      mealIndex,
      title,
      emoji,
    },
  });
  
  
  const cardHeight = Math.max(30, (duration / 60) * 60 - 8);
  
  const style: React.CSSProperties = {
    top: `${position}px`,
    height: `${cardHeight}px`,
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div
      ref={setNodeRef}
      className={mergeClasses(styles.card, isDragging && styles.dragging)}
      style={style}
      data-meal-id={id}
      {...attributes}
      {...listeners}
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