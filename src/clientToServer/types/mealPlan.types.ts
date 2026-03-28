export interface MealItem {
  recipeId: string;
  servings: number;
  time: string; // Format: "HH:mm" (e.g., "08:30", "12:00", "18:45")
  duration?: number; // Duration in minutes (optional, defaults to 60)
}

// Legacy support - keeping for backward compatibility
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// New time-based structure
export interface TimeSlot {
  time: string; // "HH:mm" format
  meals: MealItem[];
}

export interface DayMeals {
  // Legacy format (will be migrated)
  breakfast?: MealItem;
  lunch?: MealItem;
  dinner?: MealItem;
  snack?: MealItem;
  
  // New time-based format
  timeSlots?: TimeSlot[];
}

export interface MealPlan {
  _id: string;
  userId: string;
  date: string; // ISO date string YYYY-MM-DD
  meals: DayMeals;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanWithRecipes extends Omit<MealPlan, 'meals'> {
  meals: {
    // Legacy meal types
    breakfast?: MealItem & { recipe?: Record<string, unknown> };
    lunch?: MealItem & { recipe?: Record<string, unknown> };
    dinner?: MealItem & { recipe?: Record<string, unknown> };
    snack?: MealItem & { recipe?: Record<string, unknown> };
    
    // New time-based slots
    timeSlots?: Array<{
      time: string;
      meals: Array<MealItem & { recipe?: Record<string, unknown> }>;
    }>;
  };
}

export interface CreateMealPlanPayload {
  date: string;
  time: string; // "HH:mm" format
  recipeId: string;
  servings?: number;
  duration?: number; // Duration in minutes
  
  // Legacy support
  mealType?: MealType;
}

export interface UpdateMealPlanPayload {
  date: string;
  meals: DayMeals;
  notes?: string;
}

export interface BatchUpdateMealPlanPayload {
  updates: Array<{
    date: string;
    time: string; // "HH:mm" format
    recipeId: string | null;
    servings?: number;
    duration?: number;
    
    // Legacy support
    mealType?: MealType;
  }>;
}

export interface MealPlanDateRange {
  startDate: string;
  endDate: string;
}

export interface MealPlanResponse {
  mealPlans: MealPlan[];
  totalCount: number;
}

export interface MealPlanResponseWithRecipes {
  mealPlans: MealPlanWithRecipes[];
  totalCount: number;
}

import type { Recipe } from './recipes.types';

export interface UpcomingMealsResult {
  meals: Array<Recipe & { isPast?: boolean }>;
  currentMealIndex: number;
}