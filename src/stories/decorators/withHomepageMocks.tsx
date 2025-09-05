import { withApiMocks } from "../mockApi";

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../../mocks/data/recipes";
import { generateMealPlanResponse } from "../../mocks/data/mealPlans";

// Homepage-specific mock variants
export const homepageVariants = {
  default: () => withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, thaiGreenCurry],
    },
    '/api/user/recentlyViewed': {
      response: [caesarSalad, chocolateChipCookies],
    },
    '/api/meal-plans': {
      response: generateMealPlanResponse(),
    },
  }),

  empty: () => withApiMocks({
    '/api/user/collections': {
      response: [],
    },
    '/api/user/recentlyViewed': {
      response: [],
    },
    '/api/meal-plans': {
      response: { mealPlans: [], totalCount: 0 },
    },
  }),

  loading: () => withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, thaiGreenCurry],
      delay: 999999,
    },
    '/api/user/recentlyViewed': {
      response: [caesarSalad, chocolateChipCookies],
      delay: 999999,
    },
    '/api/meal-plans': {
      response: generateMealPlanResponse(),
      delay: 999999,
    },
  }),

  error: () => withApiMocks({
    '/api/user/collections': {
      response: { error: 'Server error' },
      status: 500,
    },
    '/api/user/recentlyViewed': {
      response: { error: 'Server error' },
      status: 500,
    },
    '/api/meal-plans': {
      response: { error: 'Server error' },
      status: 500,
    },
  }),

  onlyRecentlyViewed: () => withApiMocks({
    '/api/user/collections': {
      response: [],
    },
    '/api/user/recentlyViewed': {
      response: [thaiGreenCurry, caesarSalad],
    },
    '/api/meal-plans': {
      response: generateMealPlanResponse(),
    },
  }),

  onlyCollections: () => withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, caesarSalad],
    },
    '/api/user/recentlyViewed': {
      response: [],
    },
    '/api/meal-plans': {
      response: generateMealPlanResponse(),
    },
  }),
} as const;