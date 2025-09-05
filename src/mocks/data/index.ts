/**
 * Clean, abstracted mock data structure
 * Each domain is organized in its own module with individual files
 */

// Import organized data modules
export * from "./recipes";
export * from "./users";
export * from "./activity";
export * from "./mealPlans";

// Re-export for backward compatibility and convenience
import {
  userCollections,
  recentlyViewed,
  sharedUsers,
  userActivity,
} from "./activity";
import {
  allRecipes,
  RecipeCollections,
  RecipeLookup,
  RecipesByOwner,
  allTags,
} from "./recipes";
import {
  allUsers,
  testUser,
  sharedUser,
  UserLookup,
  UserByEmail,
} from "./users";

/**
 * Legacy exports for backward compatibility
 */
export const mockRecipes = allRecipes;
export const mockUsers = { testUser, sharedUser };
export const mockCollections = userCollections;
export const mockRecentlyViewed = recentlyViewed;
export const mockSharedUsers = sharedUsers;
export const mockTags = allTags;

/**
 * Enhanced data access patterns
 */
export const MockData = {
  // Recipe data
  recipes: {
    all: allRecipes,
    collections: RecipeCollections,
    lookup: RecipeLookup,
    byOwner: RecipesByOwner,
    tags: allTags,
  },

  // User data
  users: {
    all: allUsers,
    lookup: UserLookup,
    byEmail: UserByEmail,
    test: testUser,
    shared: sharedUser,
  },

  // Activity data
  activity: {
    collections: userCollections,
    recentlyViewed,
    sharedUsers,
    metadata: userActivity,
  },
};

/**
 * Data query utilities
 */
export const DataQueries = {
  // Recipe queries
  getRecipeById: (id: string) => RecipeLookup[id as keyof typeof RecipeLookup],
  getRecipesByOwner: (userId: string) =>
    allRecipes.filter((r) => r.owner === userId),
  getPublicRecipes: () => allRecipes.filter((r) => r.isPublic),
  getRecipesByTag: (tag: string) =>
    allRecipes.filter((r) => r.tags.includes(tag)),
  getRecipesByTags: (tags: string[]) =>
    allRecipes.filter((r) => tags.some((tag) => r.tags.includes(tag))),

  // User queries
  getUserById: (id: string) => UserLookup[id as keyof typeof UserLookup],
  getUserByEmail: (email: string) =>
    UserByEmail[email as keyof typeof UserByEmail],
  getUserCollections: (userId: string) => userCollections[userId] || [],
  getUserRecentlyViewed: (userId: string) => recentlyViewed[userId] || [],
  getUserSharedWith: (userId: string) => sharedUsers[userId] || [],

  // Search queries
  searchRecipes: (query: string) => {
    if (!query.trim()) {
      return allRecipes;
    }
    const searchTerm = query.toLowerCase();
    return allRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.data.toLowerCase().includes(searchTerm) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  },

  // Sort queries
  sortRecipes: (
    recipes: typeof allRecipes,
    sortProperty: string,
    sortDirection: string
  ) => {
    return [...recipes].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      if (sortProperty === "createdAt") {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      } else if (sortProperty === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else {
        return 0;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  },
};
