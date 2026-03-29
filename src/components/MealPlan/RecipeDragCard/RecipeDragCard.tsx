import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { clsx } from "clsx";

import styles from "./RecipeDragCard.module.css";

import { Text } from "../../Text";

// Recipe drag card component

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

  const containerClass = clsx(
    styles.container,
    isDragging && styles.isDragging,
    isDragging && styles.overlay
  );
  const displayEmoji = emoji && emoji.trim().length > 0 ? emoji : "🍽️";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClass}
      {...listeners}
      {...attributes}
    >
      <span className={styles.emoji}>{displayEmoji}</span>
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
