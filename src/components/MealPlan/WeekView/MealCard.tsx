import * as React from "react";
import { Text, Button, makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  card: {
    position: "absolute",
    left: tokens.spacingHorizontalXS,
    right: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke1),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXS),
    transition: "all 0.2s ease",
    zIndex: 2,
    userSelect: "none",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
      boxShadow: tokens.shadow4,
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
  
  time: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
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
}

export const MealCard: React.FC<MealCardProps> = React.memo(({
  id,
  title,
  emoji,
  time,
  duration,
  position,
  onRemove,
}) => {
  const styles = useStyles();
  
  const formatTime = (timeStr: string, durationMin: number): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + durationMin;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    const formatHour = (h: number, m: number): string => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    };
    
    return `${formatHour(hours, minutes)} - ${formatHour(endHours, endMins)}`;
  };
  
  const cardHeight = Math.max(30, (duration / 60) * 60 - 8);
  
  return (
    <div
      className={styles.card}
      style={{
        top: `${position}px`,
        height: `${cardHeight}px`,
      }}
      data-meal-id={id}
    >
      <div className={styles.header}>
        <div className={styles.content}>
          <Text className={styles.emoji}>{emoji || '🍽️'}</Text>
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
      {cardHeight > 45 && (
        <Text className={styles.time}>
          {formatTime(time, duration)}
        </Text>
      )}
    </div>
  );
});

MealCard.displayName = 'MealCard';