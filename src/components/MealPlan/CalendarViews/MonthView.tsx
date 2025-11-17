import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

import type { MonthViewProps } from "./MonthView.types";
import { DroppableDayCell } from "../components/DroppableDayCell";
import { formatDateString } from "../utils/formatDateString";
import { getCalendarDays, getMealPlanForDate, isPastDate, dayNames } from "../utils/monthCalendarUtils";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "24px repeat(6, 1fr)",
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
  dayOfWeekHeader: {
    padding: `2px ${tokens.spacingHorizontalXS}`,
    textAlign: "left",
    backgroundColor: tokens.colorNeutralBackground2,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    height: "24px",
    display: "flex",
    alignItems: "center",
    "&:last-child": {
      borderRight: "none",
    },
  },
});

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();
  
  const calendarDays = getCalendarDays(currentDate);
  const today = new Date().toDateString();
  const currentMonth = currentDate.getMonth();
  
  return (
    <div className={styles.container}>
      {/* Day of week headers */}
      {dayNames.map(day => (
        <div key={day} className={styles.dayOfWeekHeader}>
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarDays.map(date => {
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