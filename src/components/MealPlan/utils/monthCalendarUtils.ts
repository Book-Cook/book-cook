/**
 * Month calendar utility functions
 */
import { formatDateString } from "./formatDateString";

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
  const dateStr = formatDateString(date);
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
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Day names for month header
 */
export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];