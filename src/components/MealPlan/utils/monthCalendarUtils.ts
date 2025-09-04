/**
 * Month calendar utility functions
 */
import type { MealPlanWithRecipes } from "../../../clientToServer/types";

/**
 * Get all days in the month calendar view (including previous/next month days)
 */
export const getCalendarDays = (currentDate: Date): Date[] => {
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

/**
 * Get meal plan for a specific date
 */
export const getMealPlanForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): MealPlanWithRecipes | undefined => {
  const dateStr = date.toISOString().split("T")[0];
  return mealPlans.find(p => p.date === dateStr);
};

/**
 * Check if a date has passed
 */
export const isPastDate = (date: Date, isToday?: boolean): boolean => {
  if (isToday) {return false;}
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0);
  return dayDate < now;
};

/**
 * Legacy meal type to default time mapping
 */
export const legacyTimeMap: Record<string, string> = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '18:30',
  snack: '15:00',
};

/**
 * Day names for month header
 */
export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];