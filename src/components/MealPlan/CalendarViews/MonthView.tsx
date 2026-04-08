import * as React from "react";

import styles from "./MonthView.module.css";
import type { MonthViewProps } from "./MonthView.types";
import { DroppableDayCell } from "../components/DroppableDayCell";
import { formatDateString } from "../utils/formatDateString";
import {
  dayNames,
  getCalendarDays,
  getMealPlanForDate,
  isPastDate,
} from "../utils/monthCalendarUtils";

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const calendarDays = getCalendarDays(currentDate);
  const today = new Date().toDateString();
  const currentMonth = currentDate.getMonth();

  return (
    <div className={styles.container}>
      {/* Day of week headers */}
      {dayNames.map((day) => (
        <div key={day} className={styles.dayOfWeekHeader}>
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((date) => {
        const dateStr = formatDateString(date);
        const isToday = date.toDateString() === today;
        const isCurrentMonth = date.getMonth() === currentMonth;
        const mealPlan = getMealPlanForDate(date, mealPlans);
        const isPast = isPastDate(date, isToday);

        return (
          <DroppableDayCell
            key={dateStr}
            date={date}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            isPast={isPast}
            mealPlan={mealPlan}
            onMealRemove={onMealRemove}
          >
            {/* No additional children needed for month view */}
          </DroppableDayCell>
        );
      })}
    </div>
  );
};
