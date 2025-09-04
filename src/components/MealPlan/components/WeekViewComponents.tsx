/**
 * Consolidated WeekView components - combines WeekHeader, TimeColumn, CurrentTimeLine
 */
import * as React from "react";
import { Text, makeStyles, tokens, shorthands, mergeClasses } from "@fluentui/react-components";

import { isToday } from "../utils/isToday";
import { HOURS, formatHour, HOUR_HEIGHT, MIN_HOUR, TIME_COLUMN_WIDTH, DAY_NAMES } from "../WeekView/constants";

// ============================================================================
// WEEK HEADER COMPONENT  
// ============================================================================

const useHeaderStyles = makeStyles({
  header: {
    display: "grid",
    gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
    height: "24px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: `60px repeat(7, 1fr)`,
    },
  },
  
  headerTimeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
  },
  
  headerDay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding(`2px ${tokens.spacingHorizontalXS}`),
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    height: "24px",
    "&:last-child": {
      borderRightWidth: 0,
    },
  },
  
  dayText: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  
  todayHeader: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  
  todayText: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
});

type WeekHeaderProps = {
  weekDates: Date[];
};

export const WeekHeader: React.FC<WeekHeaderProps> = React.memo(({ weekDates }) => {
  const styles = useHeaderStyles();
  
  return (
    <div className={styles.header} data-testid="week-header">
      <div className={styles.headerTimeColumn} data-testid="header-time-column" />
      {weekDates.map((date, index) => {
        const isTodayDate = isToday(date);
        return (
          <div
            key={date.toISOString()}
            className={mergeClasses(styles.headerDay, isTodayDate && styles.todayHeader)}
            data-testid={isTodayDate ? "today-header" : "day-header"}
          >
            <Text className={mergeClasses(styles.dayText, isTodayDate && styles.todayText)}>
              {DAY_NAMES[index]} {date.getDate()}
            </Text>
          </div>
        );
      })}
    </div>
  );
});

WeekHeader.displayName = 'WeekHeader';

// ============================================================================
// TIME COLUMN COMPONENT
// ============================================================================

const useTimeColumnStyles = makeStyles({
  timeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    position: "sticky",
    left: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  
  timeSlot: {
    height: `${HOUR_HEIGHT}px`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  
  timeLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
    transform: "translateY(-50%)",
  },
});

export const TimeColumn: React.FC = React.memo(() => {
  const styles = useTimeColumnStyles();
  
  return (
    <div className={styles.timeColumn} data-testid="time-column">
      {HOURS.map(hour => (
        <div 
          key={hour} 
          className={styles.timeSlot}
          style={{ top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px` }}
          data-testid="time-slot"
        >
          <Text className={styles.timeLabel} data-testid="time-label">{formatHour(hour)}</Text>
        </div>
      ))}
    </div>
  );
});

TimeColumn.displayName = 'TimeColumn';

// ============================================================================
// CURRENT TIME LINE COMPONENT  
// ============================================================================

const useTimeLineStyles = makeStyles({
  currentTimeLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: tokens.colorPaletteRedBorder2,
    zIndex: 3,
    pointerEvents: "none",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "-6px",
      top: "-4px",
      width: "10px",
      height: "10px",
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      backgroundColor: tokens.colorPaletteRedBorder2,
    },
  },
});

type CurrentTimeLineProps = {
  position: number;
};

export const CurrentTimeLine: React.FC<CurrentTimeLineProps> = React.memo(({ position }) => {
  const styles = useTimeLineStyles();
  
  return (
    <div
      className={styles.currentTimeLine}
      style={{ top: `${position}px` }}
      data-testid="current-time-line"
    />
  );
});

CurrentTimeLine.displayName = 'CurrentTimeLine';