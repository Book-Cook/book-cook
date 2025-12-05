import * as React from "react";
import { makeStyles, tokens, mergeClasses } from "@fluentui/react-components";

import { TimeSlot } from "../TimeSlot/TimeSlot";
import { formatDateString } from "../utils/formatDateString";

import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";
import { generateTimeSlots, DEFAULT_TIME_CONFIG, mealTypeToTime } from "../../../utils/timeSlots";

import { Text } from "../../Text";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  dateTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    textAlign: "center",
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "80px 1fr",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
  },
  timeLabel: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  timeSlotContainer: {
    marginBottom: tokens.spacingVerticalS,
  },
  pastTime: {
    opacity: 0.5,
  },
  pastTimeLabel: {
    color: tokens.colorNeutralForeground3,
  },
});

interface HourlyDayViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
}

export const HourlyDayView: React.FC<HourlyDayViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();

  const dateStr = formatDateString(currentDate);
  const timeSlots = generateTimeSlots(DEFAULT_TIME_CONFIG);
  
  // Get meal plan for current date
  const dayPlan = mealPlans.find(plan => plan.date === dateStr);
  
  // Get all meals for the day, organized by time
  const getAllMealsOrganized = (): Map<string, Array<MealItem & { recipe?: Record<string, unknown> }>> => {
    const mealsByTime = new Map<string, Array<MealItem & { recipe?: Record<string, unknown> }>>();
    
    if (!dayPlan) {
      return mealsByTime;
    }
    
    // Add time-based slots
    if (dayPlan.meals.timeSlots && Array.isArray(dayPlan.meals.timeSlots)) {
      dayPlan.meals.timeSlots.forEach(slot => {
        if (slot.time && slot.meals) {
          mealsByTime.set(slot.time, slot.meals);
        }
      });
    }
    
    // Add legacy meal types at their default times
    const legacyMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

    legacyMealTypes.forEach((mealType) => {
      const meal = dayPlan.meals[mealType as keyof typeof dayPlan.meals];
      if (meal && typeof meal === 'object' && 'recipeId' in meal && 'servings' in meal) {
        const defaultTime = mealTypeToTime(mealType);
        // Only add if we don't already have a meal at this time from timeSlots
        if (!mealsByTime.has(defaultTime)) {
          mealsByTime.set(defaultTime, [{
            ...meal,
            time: defaultTime,
          } as MealItem & { recipe?: Record<string, unknown> }]);
        }
      }
    });
    
    return mealsByTime;
  };
  
  const allMeals = getAllMealsOrganized();
  
  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.dateTitle}>
          {formatDateHeader(currentDate)}
        </Text>
      </div>
      
      <div className={styles.timeGrid}>
        {timeSlots.map(time => {
          const meals = allMeals.get(time) ?? [];
          
          // Check if this time has passed
          const now = new Date();
          const [hours, minutes] = time.split(':').map(Number);
          const timeDate = new Date(currentDate);
          timeDate.setHours(hours, minutes, 0, 0);
          const isPast = timeDate < now;
          
          return (
            <React.Fragment key={time}>
              <div className={mergeClasses(styles.timeLabel, isPast && styles.pastTimeLabel)}>
                {time}
              </div>
              <div className={mergeClasses(styles.timeSlotContainer, isPast && styles.pastTime)}>
                <TimeSlot
                  date={dateStr}
                  time={time}
                  meals={meals}
                  onRemoveMeal={async (mealIndex) => {
                    await onMealRemove(dateStr, time, mealIndex);
                  }}
                  showTimeLabel={false}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};