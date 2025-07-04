import { generateManyPublicRecipes } from "./withRecipeMocks";
import { withApiMocks } from "../mockApi";

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../../mocks/data/recipes";

// Base mock recipes with public recipe metadata
const baseMockRecipes = [
  {
    ...chocolateChipCookies,
    savedCount: 42,
    viewCount: 203,
    creatorName: "Baker Beth",
  },
  {
    ...thaiGreenCurry,
    savedCount: 31,
    viewCount: 124,
    creatorName: "Thai Kitchen",
  },
  {
    ...caesarSalad,
    savedCount: 18,
    viewCount: 89,
    creatorName: "Chef Caesar",
  },
];

// Story variants for public recipes
export const publicRecipeVariants = {
  default: () => withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: baseMockRecipes,
        totalCount: 3,
        hasMore: false,
      },
    },
  }),

  empty: () => withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [],
        totalCount: 0,
        hasMore: false,
      },
    },
  }),

  loading: () => withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: baseMockRecipes,
        totalCount: 3,
        hasMore: false,
      },
      delay: 999999, // Never resolves
    },
  }),

  error: () => withApiMocks({
    '/api/recipes/public': {
      response: { error: 'Failed to fetch public recipes' },
      status: 500,
    },
  }),

  many: () => withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: generateManyPublicRecipes(),
        totalCount: 50,
        hasMore: true,
      },
    },
  }),

  custom: (recipes: unknown[], options: { totalCount?: number; hasMore?: boolean } = {}) => 
    withApiMocks({
      '/api/recipes/public': {
        response: {
          recipes,
          totalCount: options.totalCount ?? recipes.length,
          hasMore: options.hasMore ?? false,
        },
      },
    }),
} as const;