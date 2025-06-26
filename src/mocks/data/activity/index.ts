import { testUser, sharedUser, collaboratorUser } from "../users";

/**
 * User collections data - which recipes users have saved
 */
export const userCollections = {
  [testUser.id]: ["recipe_001", "recipe_003", "recipe_006"],
  [sharedUser.id]: ["recipe_002", "recipe_005"],
  [collaboratorUser.id]: ["recipe_004"],
};

/**
 * Recently viewed recipes by user
 */
export const recentlyViewed = {
  [testUser.id]: ["recipe_006", "recipe_002", "recipe_001"], // Most recent first
  [sharedUser.id]: ["recipe_003", "recipe_005"],
  [collaboratorUser.id]: ["recipe_004", "recipe_001"],
};

/**
 * Shared users - who each user has shared their recipes with
 */
export const sharedUsers = {
  [testUser.id]: [sharedUser.email, collaboratorUser.email],
  [sharedUser.id]: [collaboratorUser.email],
  [collaboratorUser.id]: [],
};

/**
 * User activity metadata
 */
export const userActivity = {
  [testUser.id]: {
    recipesCreated: 4,
    recipesShared: 2,
    lastLogin: "2024-03-20T10:00:00.000Z",
    favoriteTag: "main-course",
  },
  [sharedUser.id]: {
    recipesCreated: 2,
    recipesShared: 1,
    lastLogin: "2024-03-19T15:30:00.000Z",
    favoriteTag: "healthy",
  },
  [collaboratorUser.id]: {
    recipesCreated: 0,
    recipesShared: 0,
    lastLogin: "2024-03-18T09:15:00.000Z",
    favoriteTag: "italian",
  },
};
