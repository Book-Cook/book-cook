import * as React from "react";
import { Text, makeStyles, tokens } from "@fluentui/react-components";
import { useDraggable } from "@dnd-kit/core";

// Recipe drag card component

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    transition: "all 0.2s ease",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderTopColor: tokens.colorNeutralStroke1Hover,
      borderRightColor: tokens.colorNeutralStroke1Hover,
      borderBottomColor: tokens.colorNeutralStroke1Hover,
      borderLeftColor: tokens.colorNeutralStroke1Hover,
      transform: "translateY(-1px)",
      boxShadow: tokens.shadow8,
    },
  },
  isDragging: {
    opacity: 0.5,
    transform: "rotate(5deg)",
    cursor: "grabbing",
  },
  emoji: {
    fontSize: "24px",
  },
  content: {
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
  tags: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  tag: {
    fontSize: tokens.fontSizeBase100,
    padding: `1px ${tokens.spacingHorizontalXS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    color: tokens.colorNeutralForeground3,
  },
  overlay: {
    transform: "rotate(5deg)",
    boxShadow: tokens.shadow16,
    cursor: "grabbing",
  },
});

interface RecipeDragCardProps {
  id: string;
  title: string;
  emoji?: string;
  tags?: string[];
  isDragging?: boolean;
}

export const RecipeDragCard: React.FC<RecipeDragCardProps> = ({
  id,
  title,
  emoji,
  tags,
  isDragging = false,
}) => {
  const styles = useStyles();
  
  const { attributes, listeners, setNodeRef, isDragging: isActiveDrag } = useDraggable({
    id: `recipe-${id}`,
    data: {
      recipe: { id, title, emoji, tags },
    },
  });

  // Don't apply transform to the original element when using DragOverlay
  // This prevents the sidebar from scrolling during drag
  // Only apply opacity when actively dragging
  const style = isActiveDrag ? { opacity: 0.5 } : undefined;

  const containerClass = `${styles.container} ${
    isDragging ? `${styles.isDragging} ${styles.overlay}` : ""
  }`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClass}
      {...listeners}
      {...attributes}
    >
      <span className={styles.emoji}>{emoji || "🍽️"}</span>
      <div className={styles.content}>
        <Text className={styles.title}>{title}</Text>
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};