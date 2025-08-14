import * as React from "react";
import { Text, makeStyles, tokens } from "@fluentui/react-components";


import type { MealPlanWithRecipes, MealType } from "../../../clientToServer/types";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: tokens.spacingHorizontalS,
    height: "100%",
  },
  dayOfWeekHeader: {
    padding: tokens.spacingVerticalS,
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  dayCell: {
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: "150px",
    position: "relative",
  },
  dayHeader: {
    padding: tokens.spacingVerticalXS,
    textAlign: "center",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  dayNumber: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  isToday: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  otherMonth: {
    opacity: 0.4,
  },
  mealIndicators: {
    flex: 1,
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    overflow: "auto",
  },
  mealIndicator: {
    padding: "2px 4px",
    borderRadius: "4px",
    fontSize: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "2px",
    minHeight: "16px",
  },
  breakfast: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
  },
  lunch: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  dinner: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  snack: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
});

interface MonthViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, mealType: string) => Promise<void>;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove: _onMealRemove,
}) => {
  const styles = useStyles();
  
  // Get all days in the month calendar view (including previous/next month days)
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday before the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End at the last Saturday after the last day
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };
  
  const calendarDays = getCalendarDays();
  const today = new Date().toDateString();
  const currentMonth = currentDate.getMonth();
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get meal plan for a specific date
  const getMealPlan = (date: Date): MealPlanWithRecipes | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return mealPlans.find(p => p.date === dateStr);
  };
  
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
        const dateStr = date.toISOString().split("T")[0];
        const isToday = date.toDateString() === today;
        const isCurrentMonth = date.getMonth() === currentMonth;
        const mealPlan = getMealPlan(date);
        
        const cellClass = `${styles.dayCell} ${
          !isCurrentMonth ? styles.otherMonth : ""
        }`;
        
        const headerClass = `${styles.dayHeader} ${
          isToday ? styles.isToday : ""
        }`;
        
        return (
          <div key={dateStr} className={cellClass}>
            <div className={headerClass}>
              <Text className={styles.dayNumber}>
                {date.getDate()}
              </Text>
            </div>
            
            <div className={styles.mealIndicators}>
              {/* Show time-based meals if available */}
              {mealPlan?.meals?.timeSlots && Array.isArray(mealPlan.meals.timeSlots) ? (
                mealPlan.meals.timeSlots.slice(0, 4).map((slot, index) => {
                  if (!slot.meals || slot.meals.length === 0) {return null;}
                  const firstMeal = slot.meals[0];
                  
                  // Map time slots to color styles
                  const getColorStyle = (time: string) => {
                    const hour = parseInt(time.split(':')[0]);
                    if (hour < 10) {return styles.breakfast;}
                    if (hour < 14) {return styles.lunch;}
                    if (hour < 17) {return styles.snack;}
                    return styles.dinner;
                  };
                  
                  return (
                    <div
                      key={`${slot.time}-${index}`}
                      className={`${styles.mealIndicator} ${getColorStyle(slot.time)}`}
                      title={`${slot.time}: ${(firstMeal.recipe?.title as string) ?? "Recipe"}`}
                    >
                      <span>{(firstMeal.recipe?.emoji as string) ?? "🍽️"}</span>
                      <span>{(firstMeal.recipe?.title as string) ?? "Meal"}</span>
                    </div>
                  );
                })
              ) : (
                /* Fall back to legacy meal types */
                ["breakfast", "lunch", "dinner", "snack"].map(mealType => {
                  const meal = mealPlan?.meals?.[mealType as MealType];
                  if (!meal) {return null;}
                  
                  return (
                    <div
                      key={mealType}
                      className={`${styles.mealIndicator} ${styles[mealType as keyof typeof styles]}`}
                      title={`${mealType}: ${(meal.recipe?.title as string) ?? "Recipe"}`}
                    >
                      <span>{(meal.recipe?.emoji as string) ?? "🍽️"}</span>
                      <span>{(meal.recipe?.title as string) ?? mealType}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};