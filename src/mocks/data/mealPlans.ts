import {
  avocadoToast,
  beefBolognese,
  lemonGarlicSalmon
} from "./recipes";
import { MOCK_DATES, MOCK_TIMESTAMPS } from "../utils/mockDates";

import type { MealPlanWithRecipes } from "../../clientToServer/types";

// Mock meal plans for the past few days and upcoming week
export const mockMealPlans: MealPlanWithRecipes[] = [
  // Yesterday's meals (past)
  {
    _id: "meal-plan-yesterday",
    userId: "test-user-id",
    date: MOCK_DATES.yesterday,
    meals: {
      timeSlots: [
        {
          time: "08:00",
          meals: [
            {
              recipeId: avocadoToast._id,
              servings: 2,
              time: "08:00",
              duration: 15,
              recipe: {
                title: avocadoToast.title,
                emoji: avocadoToast.emoji,
                imageURL: avocadoToast.imageURL,
                tags: avocadoToast.tags,
              },
            },
          ],
        },
        {
          time: "12:30",
          meals: [
            {
              recipeId: beefBolognese._id,
              servings: 1,
              time: "12:30",
              duration: 25,
              recipe: {
                title: beefBolognese.title,
                emoji: beefBolognese.emoji,
                imageURL: beefBolognese.imageURL,
                tags: beefBolognese.tags,
              },
            },
          ],
        },
        {
          time: "19:00",
          meals: [
            {
              recipeId: beefBolognese._id,
              servings: 4,
              time: "19:00",
              duration: 90,
              recipe: {
                title: beefBolognese.title,
                emoji: beefBolognese.emoji,
                imageURL: beefBolognese.imageURL,
                tags: beefBolognese.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: MOCK_TIMESTAMPS.yesterday,
    updatedAt: MOCK_TIMESTAMPS.yesterday,
  },
  
  // Today's meals
  {
    _id: "meal-plan-today",
    userId: "test-user-id",
    date: MOCK_DATES.today,
    meals: {
      timeSlots: [
        {
          time: "08:30",
          meals: [
            {
              recipeId: avocadoToast._id,
              servings: 1,
              time: "08:30",
              duration: 20,
              recipe: {
                title: avocadoToast.title,
                emoji: avocadoToast.emoji,
                imageURL: avocadoToast.imageURL,
                tags: avocadoToast.tags,
              },
            },
          ],
        },
        {
          time: "13:00",
          meals: [
            {
              recipeId: beefBolognese._id,
              servings: 2,
              time: "13:00",
              duration: 45,
              recipe: {
                title: beefBolognese.title,
                emoji: beefBolognese.emoji,
                imageURL: beefBolognese.imageURL,
                tags: beefBolognese.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: MOCK_TIMESTAMPS.today,
    updatedAt: MOCK_TIMESTAMPS.today,
  },

  // Tomorrow's meals (upcoming)
  {
    _id: "meal-plan-tomorrow",
    userId: "test-user-id",
    date: MOCK_DATES.tomorrow,
    meals: {
      timeSlots: [
        {
          time: "07:45",
          meals: [
            {
              recipeId: avocadoToast._id,
              servings: 1,
              time: "07:45",
              duration: 15,
              recipe: {
                title: avocadoToast.title,
                emoji: avocadoToast.emoji,
                imageURL: avocadoToast.imageURL,
                tags: avocadoToast.tags,
              },
            },
          ],
        },
        {
          time: "18:30",
          meals: [
            {
              recipeId: lemonGarlicSalmon._id,
              servings: 2,
              time: "18:30",
              duration: 30,
              recipe: {
                title: lemonGarlicSalmon.title,
                emoji: lemonGarlicSalmon.emoji,
                imageURL: lemonGarlicSalmon.imageURL,
                tags: lemonGarlicSalmon.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: MOCK_TIMESTAMPS.tomorrow,
    updatedAt: MOCK_TIMESTAMPS.tomorrow,
  },

  // Day after tomorrow
  {
    _id: "meal-plan-day-after-tomorrow",
    userId: "test-user-id",
    date: MOCK_DATES.dayAfterTomorrow,
    meals: {
      timeSlots: [
        {
          time: "12:00",
          meals: [
            {
              recipeId: lemonGarlicSalmon._id,
              servings: 1,
              time: "12:00",
              duration: 25,
              recipe: {
                title: lemonGarlicSalmon.title,
                emoji: lemonGarlicSalmon.emoji,
                imageURL: lemonGarlicSalmon.imageURL,
                tags: lemonGarlicSalmon.tags,
              },
            },
          ],
        },
        {
          time: "19:30",
          meals: [
            {
              recipeId: lemonGarlicSalmon._id,
              servings: 3,
              time: "19:30",
              duration: 45,
              recipe: {
                title: lemonGarlicSalmon.title,
                emoji: lemonGarlicSalmon.emoji,
                imageURL: lemonGarlicSalmon.imageURL,
                tags: lemonGarlicSalmon.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: MOCK_TIMESTAMPS.dayAfterTomorrow,
    updatedAt: MOCK_TIMESTAMPS.dayAfterTomorrow,
  },
];

// Generate meal plan response matching API format
export const generateMealPlanResponse = (startDate?: string, endDate?: string) => {
  let filteredPlans = mockMealPlans;
  
  if (startDate && endDate) {
    filteredPlans = mockMealPlans.filter(plan => 
      plan.date >= startDate && plan.date <= endDate
    );
  }
  
  return {
    mealPlans: filteredPlans,
    totalCount: filteredPlans.length,
  };
};