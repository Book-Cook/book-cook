/**
 * Consolidated WeekView components - combines WeekHeader, TimeColumn, CurrentTimeLine
 */
import * as React from "react";
import { clsx } from "clsx";

import styles from "./WeekViewComponents.module.css";
import { isToday } from "../utils/monthCalendarUtils";
import {
  DAY_NAMES,
  HOUR_HEIGHT,
  HOURS,
  MIN_HOUR,
  TIME_COLUMN_WIDTH,
  formatHour,
} from "../WeekView/constants";

import { Text } from "../../Text";

// ============================================================================
// WEEK HEADER COMPONENT
// ============================================================================

type WeekHeaderProps = {
  weekDates: Date[];
};

export const WeekHeader: React.FC<WeekHeaderProps> = React.memo(
  ({ weekDates }) => {
    return (
      <div
        className={styles.header}
        style={{ gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)` }}
        data-testid="week-header"
      >
        <div
          className={styles.headerTimeColumn}
          data-testid="header-time-column"
        />
        {weekDates.map((date, index) => {
          const isTodayDate = isToday(date);
          return (
            <div
              key={date.toISOString()}
              className={clsx(
                styles.headerDay,
                isTodayDate && styles.todayHeader,
              )}
              data-testid={isTodayDate ? "today-header" : "day-header"}
            >
              <Text
                className={clsx(
                  styles.dayText,
                  isTodayDate && styles.todayText,
                )}
              >
                {DAY_NAMES[index]} {date.getDate()}
              </Text>
            </div>
          );
        })}
      </div>
    );
  },
);

WeekHeader.displayName = "WeekHeader";

// ============================================================================
// TIME COLUMN COMPONENT
// ============================================================================

export const TimeColumn: React.FC = React.memo(() => {
  return (
    <div className={styles.timeColumn} data-testid="time-column">
      {HOURS.map((hour) => (
        <div
          key={hour}
          className={styles.timeSlot}
          style={{
            height: `${HOUR_HEIGHT}px`,
            top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px`,
          }}
          data-testid="time-slot"
        >
          <Text className={styles.timeLabel} data-testid="time-label">
            {formatHour(hour)}
          </Text>
        </div>
      ))}
    </div>
  );
});

TimeColumn.displayName = "TimeColumn";

// ============================================================================
// CURRENT TIME LINE COMPONENT
// ============================================================================

type CurrentTimeLineProps = {
  position: number;
};

export const CurrentTimeLine: React.FC<CurrentTimeLineProps> = React.memo(
  ({ position }) => {
    return (
      <div
        className={styles.currentTimeLine}
        style={{ top: `${position}px` }}
        data-testid="current-time-line"
      />
    );
  },
);

CurrentTimeLine.displayName = "CurrentTimeLine";
