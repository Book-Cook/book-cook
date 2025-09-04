/**
 * Reusable API utilities for meal plan operations
 */
import type { ApiPayload, MealMovePayload, MealReorderPayload } from "../types";

/**
 * Generic API call utility with error handling
 */
async function apiCall<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: Record<string, unknown>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (payload && method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(endpoint, options);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add meal to meal plan
 */
export function addMeal(payload: ApiPayload) {
  return apiCall('/api/meal-plans', 'POST', payload);
}

/**
 * Remove meal from meal plan
 */
export function removeMeal(date: string, time: string, mealIndex: number) {
  return apiCall(`/api/meal-plans/${date}/${time}/${mealIndex}`, 'DELETE');
}

/**
 * Move meal to different time slot
 */
export function moveMeal(payload: MealMovePayload) {
  const { date, time, mealIndex } = payload;
  return apiCall(`/api/meal-plans/${date}/${time}/move`, 'POST', payload);
}

/**
 * Reorder meals within same time slot
 */
export function reorderMeal(payload: MealReorderPayload) {
  const { date, time } = payload;
  return apiCall(`/api/meal-plans/${date}/${time}/reorder`, 'POST', payload);
}

/**
 * Batch operations for multiple meal changes
 */
export function batchMealOperations(operations: Array<{
  type: 'add' | 'remove' | 'move' | 'reorder';
  payload: Record<string, unknown>;
}>) {
  return apiCall('/api/meal-plans/batch', 'POST', { operations });
}