import * as React from "react";
import { Text, makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { useDroppable } from "@dnd-kit/core";

import { TimeSlot } from "../TimeSlot/TimeSlot";

import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";
import { formatTimeForDisplay } from "../../../utils/timeSlots";

// Drop zone component for week day
interface WeekDayDropZoneStyles {
  addMealSlot: string;
}

const WeekDayDropZone: React.FC<{ dateStr: string; styles: WeekDayDropZoneStyles }> = ({ dateStr, styles }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `week-day-${dateStr}`,
    data: {
      date: dateStr,
      type: "week-day",
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.addMealSlot} ${isOver ? 'dropping' : ''}`}
      style={{
        borderColor: isOver ? tokens.colorBrandStroke1 : undefined,
        backgroundColor: isOver ? tokens.colorBrandBackground2 : undefined,
      }}
    >
      <Text>Drop recipe here</Text>
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    height: "100%",
    overflow: "hidden",
  },
  weekHeader: {
    display: "contents", // This makes the header items flow into the main grid
  },
  dayColumn: {
    display: "flex",
    flexDirection: "column",
    minHeight: "400px",
  },
  dayHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalXS,
    textAlign: "center",
    padding: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  dayName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1,
  },
  dayDate: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1,
  },
  isToday: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
  mealsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    flex: 1,
  },
  emptyDay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
    textAlign: "center",
    padding: tokens.spacingVerticalXL,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  addMealSlot: {
    minHeight: "60px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: tokens.spacingVerticalM,
    "&:hover": {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      backgroundColor: tokens.colorBrandBackground2,
      color: tokens.colorBrandForeground1,
    },
  },
  pastDay: {
    opacity: 0.5,
  },
  pastDayHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
});

interface CondensedWeekViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
}

export const CondensedWeekView: React.FC<CondensedWeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();
  
  // Get week dates (Sunday to Saturday)
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const weekDates = getWeekDates();
  const today = new Date().toDateString();
  
  // Get meal plan for a specific date
  const getMealPlan = (date: Date): MealPlanWithRecipes | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return mealPlans.find(p => p.date === dateStr);
  };
  
  // Get all scheduled meals for a date, sorted by time
  const getScheduledMeals = (date: Date): Array<{ time: string; meals: Array<MealItem & { recipe?: Record<string, unknown> }> }> => {
    const dayPlan = getMealPlan(date);
    if (!dayPlan) {
      return [];
    }
    
    const scheduledMeals: Array<{ time: string; meals: Array<MealItem & { recipe?: Record<string, unknown> }> }> = [];
    
    // Get time-based slots
    if (dayPlan.meals.timeSlots) {
      scheduledMeals.push(...dayPlan.meals.timeSlots);
    }
    
    // Convert legacy meal types to time slots for display
    const legacyTimeMap = {
      breakfast: '08:00',
      lunch: '12:30', 
      dinner: '18:30',
      snack: '15:00',
    };
    
    Object.entries(legacyTimeMap).forEach(([mealType, time]) => {
      const meal = dayPlan.meals[mealType as keyof typeof dayPlan.meals];
      if (meal && typeof meal === 'object' && 'recipeId' in meal && 'servings' in meal) {
        // Check if we already have a time slot for this time
        const existingSlot = scheduledMeals.find(slot => slot.time === time);
        if (existingSlot) {
          existingSlot.meals.push(meal as MealItem & { recipe?: Record<string, unknown> });
        } else {
          scheduledMeals.push({
            time,
            meals: [meal as MealItem & { recipe?: Record<string, unknown> }]
          });
        }
      }
    });
    
    // Sort by time
    return scheduledMeals.sort((a, b) => a.time.localeCompare(b.time));
  };
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={styles.container}>
      {weekDates.map((date, index) => {
        const isToday = date.toDateString() === today;
        const dateStr = date.toISOString().split("T")[0];
        const scheduledMeals = getScheduledMeals(date);
        
        // Check if this day has passed
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);
        const isPast = dayDate < now;
        
        return (
          <div key={date.toISOString()} className={`${styles.dayColumn} ${isPast ? styles.pastDay : ''}`}>
            <div className={`${styles.dayHeader} ${isPast ? styles.pastDayHeader : ''}`}>
              <Text className={`${styles.dayName} ${isToday ? styles.isToday : ""}`}>
                {dayNames[index]}
              </Text>
              <Text className={`${styles.dayDate} ${isToday ? styles.isToday : ""}`}>
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
              <WeekDayDropZone dateStr={dateStr} styles={styles} />
            </div>
          </div>
        );
      })}
    </div>
  );
};