import * as React from "react";
import { clsx } from "clsx";

import styles from "./CondensedWeekView.module.css";
import type { CondensedWeekViewProps } from "./CondensedWeekView.types";
import { WeekDayDropZone } from "../components/WeekDayDropZone";
import { TimeSlot } from "../TimeSlot/TimeSlot";
import { formatDateString } from "../utils/formatDateString";
import { getScheduledMealsForDate } from "../utils/getScheduledMealsForDate";
import { getWeekDates } from "../utils/getWeekDates";
import { dayNames, isPastDate } from "../utils/monthCalendarUtils";

import { formatTimeForDisplay } from "../../../utils/timeSlots";
import { Text } from "../../Text";

export const CondensedWeekView: React.FC<CondensedWeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const weekDates = getWeekDates(currentDate);
  const today = new Date().toDateString();

  return (
    <div className={styles.container}>
      {weekDates.map((date, index) => {
        const isToday = date.toDateString() === today;
        const dateStr = formatDateString(date);
        const scheduledMeals = getScheduledMealsForDate(date, mealPlans);
        const isPast = isPastDate(date);

        return (
          <div
            key={date.toISOString()}
            className={clsx(styles.dayColumn, isPast && styles.pastDay)}
          >
            <div
              className={clsx(
                styles.dayHeader,
                isPast && styles.pastDayHeader
              )}
            >
              <Text
                className={clsx(
                  styles.dayName,
                  isToday && styles.isToday
                )}
              >
                {dayNames[index]}
              </Text>
              <Text
                className={clsx(
                  styles.dayDate,
                  isToday && styles.isToday
                )}
              >
                {date.getDate()}
              </Text>
            </div>

            <div className={styles.mealsContainer}>
              {scheduledMeals.length === 0 ? (
                <div className={styles.emptyDay}>
                  <Text>No meals planned</Text>
                </div>
              ) : (
                scheduledMeals.map((timeSlot, timeIndex) => (
                  <div
                    key={`${dateStr}-${timeSlot.time}-${timeIndex}`}
                    style={{ marginBottom: '12px' }}
                  >
                    <Text
                      style={{
                        fontSize: '10px',
                        color: 'var(--ui-TextLabel)',
                        marginBottom: '4px',
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      {formatTimeForDisplay(timeSlot.time)}
                    </Text>
                    <TimeSlot
                      date={dateStr}
                      time={timeSlot.time}
                      meals={timeSlot.meals}
                      onRemoveMeal={async (mealIndex) => {
                        await onMealRemove(dateStr, timeSlot.time, mealIndex);
                      }}
                      showTimeLabel={false}
                    />
                  </div>
                ))
              )}

              {/* Drop zone for new meals */}
              <WeekDayDropZone
                dateStr={dateStr}
                className={styles.addMealSlot}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
