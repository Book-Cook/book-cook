import type { MealPlanWithRecipes } from "../../clientToServer/types";
import { 
  chocolateChipCookies, 
  thaiGreenCurry, 
  caesarSalad, 
  avocadoToast,
  beefBolognese,
  lemonGarlicSalmon
} from "./recipes";

// Helper to create dates relative to today
const getDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Mock meal plans for the past few days and upcoming week
export const mockMealPlans: MealPlanWithRecipes[] = [
  // Yesterday's meals (past)
  {
    _id: "meal-plan-yesterday",
    userId: "test-user-id",
    date: getDate(-1),
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
              recipeId: caesarSalad._id,
              servings: 1,
              time: "12:30",
              duration: 25,
              recipe: {
                title: caesarSalad.title,
                emoji: caesarSalad.emoji,
                imageURL: caesarSalad.imageURL,
                tags: caesarSalad.tags,
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Today's meals
  {
    _id: "meal-plan-today",
    userId: "test-user-id",
    date: getDate(0),
    meals: {
      timeSlots: [
        {
          time: "08:30",
          meals: [
            {
              recipeId: chocolateChipCookies._id,
              servings: 1,
              time: "08:30",
              duration: 20,
              recipe: {
                title: chocolateChipCookies.title,
                emoji: chocolateChipCookies.emoji,
                imageURL: chocolateChipCookies.imageURL,
                tags: chocolateChipCookies.tags,
              },
            },
          ],
        },
        {
          time: "13:00",
          meals: [
            {
              recipeId: thaiGreenCurry._id,
              servings: 2,
              time: "13:00",
              duration: 45,
              recipe: {
                title: thaiGreenCurry.title,
                emoji: thaiGreenCurry.emoji,
                imageURL: thaiGreenCurry.imageURL,
                tags: thaiGreenCurry.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Tomorrow's meals (upcoming)
  {
    _id: "meal-plan-tomorrow",
    userId: "test-user-id",
    date: getDate(1),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Day after tomorrow
  {
    _id: "meal-plan-day-after-tomorrow",
    userId: "test-user-id",
    date: getDate(2),
    meals: {
      timeSlots: [
        {
          time: "12:00",
          meals: [
            {
              recipeId: caesarSalad._id,
              servings: 1,
              time: "12:00",
              duration: 25,
              recipe: {
                title: caesarSalad.title,
                emoji: caesarSalad.emoji,
                imageURL: caesarSalad.imageURL,
                tags: caesarSalad.tags,
              },
            },
          ],
        },
        {
          time: "19:30",
          meals: [
            {
              recipeId: thaiGreenCurry._id,
              servings: 3,
              time: "19:30",
              duration: 45,
              recipe: {
                title: thaiGreenCurry.title,
                emoji: thaiGreenCurry.emoji,
                imageURL: thaiGreenCurry.imageURL,
                tags: thaiGreenCurry.tags,
              },
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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