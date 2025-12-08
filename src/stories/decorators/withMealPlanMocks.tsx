// Meal plan mocks for Storybook
import { withApiMocks, type MockHandlerRequest } from "../mockApi";

import type { Recipe } from "../../clientToServer/types";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese } from "../../mocks/data/recipes";
import { getMockId, getMockTimestamp } from "../../mocks/utils/mockDates";

type MockMeal = {
  recipeId: string;
  servings: number;
  time?: string;
  duration?: number;
  recipe?: Recipe;
};

type MockMealPlan = {
  _id: string;
  userId: string;
  date: string;
  meals: {
    breakfast?: MockMeal;
    lunch?: MockMeal;
    dinner?: MockMeal;
    snack?: MockMeal;
    timeSlots?: Array<{ time: string; meals: MockMeal[] }>;
  };
  createdAt: string;
  updatedAt: string;
};

// Mock meal plans data
const mockMealPlans: MockMealPlan[] = [
  {
    _id: "mealplan_001",
    userId: "user_001",
    date: "2024-01-15",
    meals: {
      breakfast: {
        recipeId: chocolateChipCookies._id,
        servings: 1,
        recipe: chocolateChipCookies,
      },
      lunch: {
        recipeId: caesarSalad._id,
        servings: 2,
        recipe: caesarSalad,
      },
    },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    _id: "mealplan_002",
    userId: "user_001",
    date: "2024-01-16",
    meals: {
      lunch: {
        recipeId: thaiGreenCurry._id,
        servings: 1,
        recipe: thaiGreenCurry,
      },
      dinner: {
        recipeId: beefBolognese._id,
        servings: 3,
        recipe: beefBolognese,
      },
    },
    createdAt: "2024-01-16T08:00:00Z",
    updatedAt: "2024-01-16T08:00:00Z",
  },
  {
    _id: "mealplan_003",
    userId: "user_001",
    date: "2024-01-17",
    meals: {
      breakfast: {
        recipeId: chocolateChipCookies._id,
        servings: 1,
        recipe: chocolateChipCookies,
      },
      dinner: {
        recipeId: thaiGreenCurry._id,
        servings: 2,
        recipe: thaiGreenCurry,
      },
      snack: {
        recipeId: chocolateChipCookies._id,
        servings: 1,
        recipe: chocolateChipCookies,
      },
    },
    createdAt: "2024-01-17T08:00:00Z",
    updatedAt: "2024-01-17T08:00:00Z",
  },
];

const parseRequestBody = (req: MockHandlerRequest) => {
  const { body } = req;
  if (!body) {return {};}
  
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  
  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }
  
  return {};
};

// Create a stateful mock that can be updated
let currentMealPlans: MockMealPlan[] = [...mockMealPlans];

// Helper to add meal to mock data
const addMealToMockData = (date: string, time: string, recipeId: string, servings: number = 1) => {
  const existingPlanIndex = currentMealPlans.findIndex(plan => plan.date === date);
  
  if (existingPlanIndex >= 0) {
    const plan = currentMealPlans[existingPlanIndex];
    
    plan.meals.timeSlots ??= [];
    
    // Find existing time slot or create new one
    const existingSlotIndex = plan.meals.timeSlots.findIndex((slot) => slot.time === time);
    const newMeal: MockMeal = {
      recipeId,
      servings,
      time,
      recipe: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese].find(r => r._id === recipeId)
    };
    
    if (existingSlotIndex >= 0) {
      plan.meals.timeSlots[existingSlotIndex].meals.push(newMeal);
    } else {
      plan.meals.timeSlots.push({
        time,
        meals: [newMeal]
      });
    }
  } else {
    // Create new meal plan
    const newPlan = {
      _id: getMockId('mealplan'),
      userId: "user_001",
      date,
      meals: {
        timeSlots: [{
          time,
          meals: [{
            recipeId,
            servings,
            time,
            recipe: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese].find(r => r._id === recipeId)
          }]
        }]
      },
      createdAt: getMockTimestamp(),
      updatedAt: getMockTimestamp(),
    };
    currentMealPlans.push(newPlan);
  }
};

// Meal plan mock variants
export const mealPlanVariants = {
  default: () => withApiMocks({
    '/api/meal-plans': {
      GET: {
        response: {
          mealPlans: currentMealPlans,
          totalCount: currentMealPlans.length,
        },
      },
      POST: {
        response: { message: "Meal plan updated successfully" },
        status: 201,
        delay: 300,
        handler: (req: MockHandlerRequest) => {
          const body = parseRequestBody(req);
          const { date, time, recipeId, servings = 1 } = body;
          
          if (date && time && recipeId) {
            addMealToMockData(date, time, recipeId, servings);
          }
          
          return { message: "Meal plan updated successfully" };
        }
      }
    },
    '/api/recipes': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese],
        totalCount: 4,
        hasMore: false,
      },
    },
  }),

  withMeals: () => withApiMocks({
    '/api/meal-plans': {
      GET: {
        response: {
          mealPlans: mockMealPlans,
          totalCount: mockMealPlans.length,
        },
      },
      POST: {
        response: { message: "Meal plan updated successfully" },
        status: 201,
        delay: 300,
        handler: (req: MockHandlerRequest) => {
          const body = parseRequestBody(req);
          const { date, time, recipeId, servings = 1 } = body;
          
          if (date && time && recipeId) {
            addMealToMockData(date, time, recipeId, servings);
          }
          
          return { message: "Meal plan updated successfully" };
        }
      }
    },
    '/api/recipes': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese],
        totalCount: 4,
        hasMore: false,
      },
    },
  }),

  empty: () => {
    currentMealPlans = []; // Reset to empty
    return withApiMocks({
      '/api/meal-plans': {
        GET: {
          response: {
            mealPlans: [],
            totalCount: 0,
          },
        },
      POST: {
        response: { message: "Meal plan updated successfully" },
        status: 201,
        delay: 300,
        handler: (req: MockHandlerRequest) => {
          const body = parseRequestBody(req);
          const { date, time, recipeId, servings = 1 } = body;
          
          if (date && time && recipeId) {
            addMealToMockData(date, time, recipeId, servings);
          }
            
            return { message: "Meal plan updated successfully" };
          }
        }
      },
      '/api/recipes': {
        response: {
          recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese],
          totalCount: 4,
          hasMore: false,
        },
      },
    });
  },

  loading: () => withApiMocks({
    '/api/meal-plans': {
      response: {
        mealPlans: mockMealPlans,
        totalCount: mockMealPlans.length,
      },
      delay: 999999,
    },
    '/api/recipes': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese],
        totalCount: 4,
        hasMore: false,
      },
      delay: 999999,
    },
  }),

  error: () => withApiMocks({
    '/api/meal-plans': {
      response: { error: 'Failed to fetch meal plans' },
      status: 500,
    },
    '/api/recipes': {
      response: { error: 'Failed to fetch recipes' },
      status: 500,
    },
  }),
} as const;
