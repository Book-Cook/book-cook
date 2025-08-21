import * as React from "react";
import { Text, Button, makeStyles, tokens } from "@fluentui/react-components";
import { Dismiss12Regular } from "@fluentui/react-icons";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/router";

import type { MealPlanWithRecipes, MealType } from "../../../clientToServer/types";

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
  dayCell: {
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    position: "relative",
    overflowY: "hidden",
    "&:nth-child(7n)": {
      borderRight: "none",
    },
  },
  dayHeader: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    textAlign: "left",
    backgroundColor: "transparent",
  },
  dayNumber: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  isToday: {
    // Remove background color, let the circular indicator be the only visual cue
  },
  isTodayNumber: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  isTodayText: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
  otherMonth: {
    opacity: 0.4,
  },
  pastDay: {
    opacity: 0.5,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  pastDayHeader: {
    backgroundColor: "transparent",
  },
  isDraggingOver: {
    backgroundColor: tokens.colorBrandBackground2,
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
  mealIndicators: {
    flex: 1,
    padding: "2px",
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    overflow: "hidden",
    minHeight: 0,
    maxHeight: "calc(120px - 24px)", // dayCell height minus dayHeader height
  },
  mealIndicator: {
    padding: "1px 4px 1px 2px",
    borderRadius: "2px",
    fontSize: "9px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2px",
    height: "14px",
    maxHeight: "14px",
    minHeight: "14px",
    cursor: "pointer",
    position: "relative",
    backgroundColor: "transparent",
    flexShrink: 0,
    "&:hover": {
      transform: "scale(1.02)",
      "& .meal-remove-button": {
        opacity: 1,
      },
    },
  },
  mealContent: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    overflow: "hidden",
    flex: 1,
    paddingLeft: "2px",
  },
  mealEmoji: {
    fontSize: "8px",
    flexShrink: 0,
  },
  mealTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    minWidth: 0,
  },
  removeButton: {
    minWidth: "12px",
    width: "12px",
    height: "12px",
    padding: "0",
    opacity: 0.6,
    transition: "opacity 0.2s ease",
    flexShrink: 0,
    backgroundColor: "transparent",
    borderRadius: "2px",
    border: "none",
    color: tokens.colorNeutralForeground3,
    "&:hover": {
      opacity: 1,
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
    },
  },
  breakfast: {},
  lunch: {},
  dinner: {},
  snack: {},
});

interface MonthViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();
  const router = useRouter();
  
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

  const handleMealClick = (recipeId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking the remove button
    if ((event.target as HTMLElement).closest('.meal-remove-button')) {
      event.stopPropagation();
      return;
    }
    void router.push(`/recipes/${recipeId}`);
  };

  const handleRemoveClick = (date: string, time: string, mealIndex: number, event: React.MouseEvent) => {
    event.stopPropagation();
    void onMealRemove(date, time, mealIndex);
  };

  // Create a droppable day cell component
  const DroppableDayCell: React.FC<{
    date: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
    isPast: boolean;
    mealPlan: MealPlanWithRecipes | undefined;
    children: React.ReactNode;
  }> = ({ date, isToday, isCurrentMonth, isPast, mealPlan: _mealPlan, children }) => {
    const dateStr = date.toISOString().split("T")[0];
    
    const { isOver, setNodeRef } = useDroppable({
      id: `month-day-${dateStr}`,
      data: {
        date: dateStr,
        type: "month-day",
      },
    });

    const cellClass = `${styles.dayCell} ${
      !isCurrentMonth ? styles.otherMonth : ""
    } ${isPast ? styles.pastDay : ""} ${isToday ? styles.isToday : ""} ${
      isOver ? styles.isDraggingOver : ""
    }`;

    return (
      <div ref={setNodeRef} className={cellClass}>
        {children}
      </div>
    );
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
        
        // Check if this day has passed
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);
        const isPast = dayDate < now && !isToday;
        
        const headerClass = `${styles.dayHeader} ${isPast ? styles.pastDayHeader : ""}`;
        
        return (
          <DroppableDayCell
            key={dateStr}
            date={date}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            isPast={isPast}
            mealPlan={mealPlan}
          >
            <div className={headerClass}>
              {isToday ? (
                <div className={styles.isTodayNumber}>
                  {date.getDate()}
                </div>
              ) : (
                <Text className={`${styles.dayNumber} ${isToday ? styles.isTodayText : ""}`}>
                  {date.getDate()}
                </Text>
              )}
            </div>
            
            <div className={styles.mealIndicators}>
              {/* Show time-based meals if available */}
              {mealPlan?.meals?.timeSlots && Array.isArray(mealPlan.meals.timeSlots) ? (
                // Sort time slots by time first, then flatten
                mealPlan.meals.timeSlots
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .flatMap((slot, slotIndex) => {
                  if (!slot.meals || slot.meals.length === 0) {return [];}
                  
                  
                  // Show each meal in the time slot
                  return slot.meals.map((meal, mealIndex) => (
                    <div
                      key={`${slot.time}-${slotIndex}-${mealIndex}`}
                      className={styles.mealIndicator}
                      title={`${slot.time}: ${(meal.recipe?.title as string) ?? "Recipe"} - Click to view`}
                      onClick={(e) => handleMealClick(meal.recipeId, e)}
                    >
                      <div className={styles.mealContent}>
                        <span className={styles.mealEmoji}>{(meal.recipe?.emoji as string) ?? "🍽️"}</span>
                        <span className={styles.mealTitle}>{(meal.recipe?.title as string) ?? "Meal"}</span>
                      </div>
                      <Button
                        appearance="subtle"
                        className={`${styles.removeButton} meal-remove-button`}
                        icon={<Dismiss12Regular />}
                        onClick={(e) => handleRemoveClick(dateStr, slot.time, mealIndex, e)}
                        title="Remove meal"
                      />
                    </div>
                  ));
                })
              ) : (
                /* Fall back to legacy meal types */
                ["breakfast", "lunch", "dinner", "snack"].map(mealType => {
                  const meal = mealPlan?.meals?.[mealType as MealType];
                  if (!meal) {return null;}
                  
                  // Map legacy meal types to default times for removal
                  const legacyTimeMap: Record<string, string> = {
                    breakfast: '08:00',
                    lunch: '12:30',
                    dinner: '18:30',
                    snack: '15:00',
                  };
                  
                  return (
                    <div
                      key={mealType}
                      className={styles.mealIndicator}
                      title={`${mealType}: ${(meal.recipe?.title as string) ?? "Recipe"} - Click to view`}
                      onClick={(e) => handleMealClick(meal.recipeId, e)}
                    >
                      <div className={styles.mealContent}>
                        <span className={styles.mealEmoji}>{(meal.recipe?.emoji as string) ?? "🍽️"}</span>
                        <span className={styles.mealTitle}>{(meal.recipe?.title as string) ?? mealType}</span>
                      </div>
                      <Button
                        appearance="subtle"
                        className={`${styles.removeButton} meal-remove-button`}
                        icon={<Dismiss12Regular />}
                        onClick={(e) => handleRemoveClick(dateStr, legacyTimeMap[mealType], 0, e)}
                        title="Remove meal"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </DroppableDayCell>
        );
      })}
    </div>
  );
};