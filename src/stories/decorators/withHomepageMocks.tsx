import { baseRecipes } from "./withRecipeMocks";
import { withApiMocks } from "../mockApi";

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../../mocks/data/recipes";

// Homepage-specific mock variants
export const homepageVariants = {
  default: () => withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, thaiGreenCurry],
    },
    '/api/user/recentlyViewed': {
      response: [caesarSalad, chocolateChipCookies],
    },
  }),

  empty: () => withApiMocks({
    '/api/user/collections': {
      response: [],
    },
    '/api/user/recentlyViewed': {
      response: [],
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
  }),

  onlyRecentlyViewed: () => withApiMocks({
    '/api/user/collections': {
      response: [],
    },
    '/api/user/recentlyViewed': {
      response: [thaiGreenCurry, caesarSalad],
    },
  }),

  onlyCollections: () => withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, caesarSalad],
    },
    '/api/user/recentlyViewed': {
      response: [],
    },
  }),
} as const;