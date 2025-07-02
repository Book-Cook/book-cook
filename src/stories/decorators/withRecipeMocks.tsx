import { withApiMocks } from "../mockApi";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese, avocadoToast, lemonGarlicSalmon } from "../../mocks/data/recipes";

// Base recipe collection
export const baseRecipes = [
  chocolateChipCookies,
  thaiGreenCurry, 
  caesarSalad,
  beefBolognese,
  avocadoToast,
  lemonGarlicSalmon,
];

// Generate extended recipe sets
export const generateManyRecipes = (baseSet = baseRecipes) => [
  ...baseSet,
  { ...chocolateChipCookies, _id: "recipe_007", title: "Double Chocolate Cookies" },
  { ...thaiGreenCurry, _id: "recipe_008", title: "Red Thai Curry" },
  { ...caesarSalad, _id: "recipe_009", title: "Greek Salad" },
  { ...beefBolognese, _id: "recipe_010", title: "Spaghetti Carbonara" },
  { ...avocadoToast, _id: "recipe_011", title: "Avocado Smoothie Bowl" },
];

// For public recipes with additional metadata
export const generateManyPublicRecipes = () => [
  {
    title: "Chocolate Chip Cookies",
    savedCount: 50,
    viewCount: 200,
    creatorName: "Baker Beth",
    _id: "recipe_001",
    tags: ["dessert", "cookies"],
    emoji: "🍪",
  },
  {
    title: "Thai Green Curry", 
    savedCount: 35,
    viewCount: 150,
    creatorName: "Thai Kitchen",
    _id: "recipe_002",
    tags: ["thai", "curry", "spicy"],
    emoji: "🍛",
  },
  {
    title: "Caesar Salad",
    savedCount: 20,
    viewCount: 100, 
    creatorName: "Chef Caesar",
    _id: "recipe_003",
    tags: ["salad", "healthy"],
    emoji: "🥗",
  },
  {
    title: "Beef Bolognese",
    savedCount: 45,
    viewCount: 180,
    creatorName: "Italian Chef",
    _id: "recipe_004", 
    tags: ["pasta", "beef", "italian"],
    emoji: "🍝",
  },
  {
    title: "Avocado Toast",
    savedCount: 30,
    viewCount: 120,
    creatorName: "Health Guru",
    _id: "recipe_005",
    tags: ["breakfast", "healthy", "avocado"],
    emoji: "🥑",
  },
  {
    title: "Lemon Garlic Salmon",
    savedCount: 40,
    viewCount: 160,
    creatorName: "Seafood Master",
    _id: "recipe_006",
    tags: ["salmon", "healthy", "dinner"],
    emoji: "🐟",
  },
];

// Recipe mock variants
export const recipeVariants = {
  default: () => withApiMocks({
    '/api/recipes': {
      response: baseRecipes,
    },
  }),

  many: () => withApiMocks({
    '/api/recipes': {
      response: generateManyRecipes(),
    },
  }),

  empty: () => withApiMocks({
    '/api/recipes': {
      response: [],
    },
  }),

  loading: () => withApiMocks({
    '/api/recipes': {
      response: baseRecipes,
      delay: 999999,
    },
  }),

  error: () => withApiMocks({
    '/api/recipes': {
      response: { error: 'Server error' },
      status: 500,
    },
  }),

  custom: (recipes: unknown[]) => withApiMocks({
    '/api/recipes': {
      response: recipes,
    },
  }),
} as const;