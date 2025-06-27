import { avocadoToast } from "./avocadoToast";
import { beefBolognese } from "./beefBolognese";
import { caesarSalad } from "./caesarSalad";
import { chocolateChipCookies } from "./chocolateChipCookies";
import { lemonGarlicSalmon } from "./lemonGarlicSalmon";
import { thaiGreenCurry } from "./thaiGreenCurry";

/**
 * Individual recipe exports
 */
export {
  avocadoToast,
  beefBolognese,
  caesarSalad,
  chocolateChipCookies,
  lemonGarlicSalmon,
  thaiGreenCurry,
};

/**
 * All recipes collection
 */
export const allRecipes = [
  chocolateChipCookies,
  thaiGreenCurry,
  caesarSalad,
  beefBolognese,
  avocadoToast,
  lemonGarlicSalmon,
];

/**
 * Organized recipe collections by category
 */
export const RecipeCollections = {
  // By meal type
  breakfast: [avocadoToast],
  lunch: [caesarSalad, avocadoToast],
  dinner: [thaiGreenCurry, beefBolognese, lemonGarlicSalmon],
  dessert: [chocolateChipCookies],

  // By dietary preferences
  vegetarian: [caesarSalad, avocadoToast, chocolateChipCookies],
  healthy: [caesarSalad, avocadoToast, lemonGarlicSalmon],
  quick: [caesarSalad, avocadoToast, lemonGarlicSalmon],

  // By cuisine
  italian: [beefBolognese],
  thai: [thaiGreenCurry],
  american: [chocolateChipCookies, avocadoToast],

  // By cooking method
  baked: [chocolateChipCookies, lemonGarlicSalmon],
  stovetop: [thaiGreenCurry, beefBolognese],
  nocook: [caesarSalad, avocadoToast],

  // By difficulty
  easy: [avocadoToast, caesarSalad, lemonGarlicSalmon],
  medium: [chocolateChipCookies, thaiGreenCurry],
  advanced: [beefBolognese],

  // By visibility
  public: [
    chocolateChipCookies,
    caesarSalad,
    beefBolognese,
    avocadoToast,
    lemonGarlicSalmon,
  ],
  private: [thaiGreenCurry],
};

/**
 * Recipe lookup by ID
 */
export const RecipeLookup = {
  recipe_001: chocolateChipCookies,
  recipe_002: thaiGreenCurry,
  recipe_003: caesarSalad,
  recipe_004: beefBolognese,
  recipe_005: avocadoToast,
  recipe_006: lemonGarlicSalmon,
} as const;

/**
 * Quick access by owner
 */
export const RecipesByOwner = {
  user_123: [
    chocolateChipCookies,
    thaiGreenCurry,
    beefBolognese,
    lemonGarlicSalmon,
  ],
  user_456: [caesarSalad, avocadoToast],
};

/**
 * All unique tags from recipes
 */
export const allTags = Array.from(
  new Set(allRecipes.flatMap((recipe) => recipe.tags))
).sort();
