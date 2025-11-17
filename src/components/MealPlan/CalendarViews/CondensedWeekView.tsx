import * as React from "react";
import { Text, mergeClasses, tokens } from "@fluentui/react-components";

import { useCondensedWeekViewStyles } from "./CondensedWeekView.styles";
import type { CondensedWeekViewProps } from "./CondensedWeekView.types";
import { WeekDayDropZone } from "../components/WeekDayDropZone";
import { TimeSlot } from "../TimeSlot/TimeSlot";
import { formatDateString } from "../utils/formatDateString";
import { getScheduledMealsForDate } from "../utils/getScheduledMealsForDate";
import { getWeekDates } from "../utils/getWeekDates";
import { dayNames, isPastDate } from "../utils/monthCalendarUtils";

import { formatTimeForDisplay } from "../../../utils/timeSlots";

export const CondensedWeekView: React.FC<CondensedWeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useCondensedWeekViewStyles();
  
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
          <div key={date.toISOString()} className={mergeClasses(styles.dayColumn, isPast && styles.pastDay)}>
            <div className={mergeClasses(styles.dayHeader, isPast && styles.pastDayHeader)}>
              <Text className={mergeClasses(styles.dayName, isToday && styles.isToday)}>
                {dayNames[index]}
              </Text>
              <Text className={mergeClasses(styles.dayDate, isToday && styles.isToday)}>
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
                  <div key={`${dateStr}-${timeSlot.time}-${timeIndex}`} style={{ marginBottom: tokens.spacingVerticalM }}>
                    <Text 
                      style={{ 
                        fontSize: tokens.fontSizeBase100, 
                        color: tokens.colorNeutralForeground3,
                        marginBottom: tokens.spacingVerticalXS,
                        fontWeight: tokens.fontWeightSemibold,
                        display: "block"
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
              <WeekDayDropZone dateStr={dateStr} className={styles.addMealSlot} />
            </div>
          </div>
        );
      })}
    </div>
  );
};