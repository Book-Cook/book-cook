import { http, HttpResponse } from "msw";

import {
  mockRecipes,
  mockUsers,
  mockCollections,
  mockRecentlyViewed,
  mockSharedUsers,
  // mockTags,
  createMockRecipe,
  // getRecipesByUser,
  // getPublicRecipes,
  getRecipesByTags,
  searchRecipes,
  sortRecipes,
} from "./mockData";
import type { Recipe } from "../clientToServer/types";

// In-memory storage for testing (resets between tests)
let recipesStore = [...mockRecipes];
let collectionsStore = { ...mockCollections };
let recentlyViewedStore = { ...mockRecentlyViewed };
let sharedUsersStore = { ...mockSharedUsers };

// Helper to simulate authentication
const getCurrentUser = (request: Request) => {
  // In real app, this would check session/token
  // For mocking, we'll use a header or default to testUser
  const userId = request.headers.get("x-user-id") ?? mockUsers.testUser.id;
  return (
    Object.values(mockUsers).find((user) => user.id === userId) ??
    mockUsers.testUser
  );
};

// Helper to check if user can access recipe
const canAccessRecipe = (
  recipe: Recipe,
  userId: string,
  userEmail: string
): boolean => {
  // Public recipes are accessible to everyone
  if (recipe.isPublic) {
    return true;
  }

  // Owner can always access
  if (recipe.owner === userId) {
    return true;
  }

  // Check if recipe owner has shared with current user
  const ownerSharedUsers = sharedUsersStore[recipe.owner] || [];
  return ownerSharedUsers.includes(userEmail);
};

export const recipeHandlers = [
  // GET /api/recipes - Fetch all recipes with filtering
  http.get("/api/recipes", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const sortProperty = url.searchParams.get("sortProperty") ?? "createdAt";
    const sortDirection = url.searchParams.get("sortDirection") ?? "desc";
    const tags = url.searchParams.getAll("tags");

    const currentUser = getCurrentUser(request);

    // Validate sort parameters
    const validSortProperties = ["createdAt", "title"];
    const validDirections = ["asc", "desc"];

    if (
      !validSortProperties.includes(sortProperty) ||
      !validDirections.includes(sortDirection)
    ) {
      return HttpResponse.json(
        { message: "Invalid sorting parameters." },
        { status: 400 }
      );
    }

    try {
      // Get recipes user can access
      let accessibleRecipes = recipesStore.filter((recipe) =>
        canAccessRecipe(recipe, currentUser.id, currentUser.email)
      );

      // Apply search filter
      if (search) {
        accessibleRecipes = searchRecipes(search).filter((recipe) =>
          accessibleRecipes.some((ar) => ar._id === recipe._id)
        );
      }

      // Apply tag filters
      if (tags.length > 0) {
        accessibleRecipes = getRecipesByTags(tags).filter((recipe) =>
          accessibleRecipes.some((ar) => ar._id === recipe._id)
        );
      }

      // Apply sorting
      const sortedRecipes = sortRecipes(
        accessibleRecipes,
        sortProperty,
        sortDirection
      );

      return HttpResponse.json(sortedRecipes);
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // POST /api/recipes - Create new recipe
  http.post("/api/recipes", async ({ request }) => {
    const currentUser = getCurrentUser(request);

    try {
      const body = (await request.json()) as {
        title: string;
        data?: string;
        tags?: string[];
        imageURL?: string;
        emoji?: string;
        isPublic?: boolean;
      };

      if (!body.title?.trim()) {
        return HttpResponse.json(
          { message: "Title required." },
          { status: 400 }
        );
      }

      const newRecipe = createMockRecipe({
        title: body.title.trim(),
        data: body.data ?? "",
        tags: Array.isArray(body.tags) ? body.tags : [],
        imageURL: body.imageURL ?? "",
        emoji: body.emoji ?? "🍽️",
        owner: currentUser.id,
        isPublic: body.isPublic ?? false,
      });

      recipesStore.push(newRecipe);

      return HttpResponse.json(
        {
          message: "Recipe uploaded successfully.",
          recipeId: newRecipe._id,
        },
        { status: 201 }
      );
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // GET /api/recipes/[id] - Get specific recipe
  http.get("/api/recipes/:id", ({ params, request }) => {
    const { id } = params;
    const currentUser = getCurrentUser(request);

    const recipe = recipesStore.find((r) => r._id === id);

    if (!recipe) {
      return HttpResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    if (!canAccessRecipe(recipe, currentUser.id, currentUser.email)) {
      return HttpResponse.json(
        { message: "Not authorized to view this recipe" },
        { status: 403 }
      );
    }

    // Update recently viewed (simulate the behavior)
    if (!recentlyViewedStore[currentUser.id]) {
      recentlyViewedStore[currentUser.id] = [];
    }

    const recentlyViewed = recentlyViewedStore[currentUser.id];
    const existingIndex = recentlyViewed.indexOf(recipe._id);

    if (existingIndex > -1) {
      recentlyViewed.splice(existingIndex, 1);
    }

    recentlyViewed.push(recipe._id);

    // Keep only last 10 items
    if (recentlyViewed.length > 10) {
      recentlyViewed.splice(0, recentlyViewed.length - 10);
    }

    return HttpResponse.json(recipe);
  }),

  // PUT /api/recipes/[id] - Update recipe
  http.put("/api/recipes/:id", async ({ params, request }) => {
    const { id } = params;
    const currentUser = getCurrentUser(request);

    const recipeIndex = recipesStore.findIndex((r) => r._id === id);

    if (recipeIndex === -1) {
      return HttpResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    const recipe = recipesStore[recipeIndex];

    // Check authorization (owner or shared user)
    const isOwner = recipe.owner === currentUser.id;
    const isSharedUser = sharedUsersStore[recipe.owner]?.includes(
      currentUser.email
    );

    if (!isOwner && !isSharedUser) {
      return HttpResponse.json(
        { message: "Not authorized to update this recipe" },
        { status: 403 }
      );
    }

    try {
      const updates = (await request.json()) as Partial<Recipe>;

      // Update the recipe
      recipesStore[recipeIndex] = {
        ...recipe,
        ...updates,
        _id: recipe._id, // Don't allow ID changes
        owner: recipe.owner, // Don't allow owner changes
        createdAt: recipe.createdAt, // Don't allow created date changes
      };

      return HttpResponse.json({
        message: "Recipe updated successfully",
      });
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // DELETE /api/recipes/[id] - Delete recipe
  http.delete("/api/recipes/:id", ({ params, request }) => {
    const { id } = params;
    const currentUser = getCurrentUser(request);

    const recipeIndex = recipesStore.findIndex((r) => r._id === id);

    if (recipeIndex === -1) {
      return HttpResponse.json(
        { message: "Recipe not found." },
        { status: 404 }
      );
    }

    const recipe = recipesStore[recipeIndex];

    // Check authorization
    const isOwner = recipe.owner === currentUser.id;
    const isSharedUser = sharedUsersStore[recipe.owner]?.includes(
      currentUser.email
    );

    if (!isOwner && !isSharedUser) {
      return HttpResponse.json(
        { message: "Not authorized to update this recipe" },
        { status: 403 }
      );
    }

    // Remove recipe
    recipesStore.splice(recipeIndex, 1);

    // Remove from collections
    Object.keys(collectionsStore).forEach((userId) => {
      collectionsStore[userId] = collectionsStore[userId].filter(
        (recipeId) => recipeId !== id
      );
    });

    // Remove from recently viewed
    Object.keys(recentlyViewedStore).forEach((userId) => {
      recentlyViewedStore[userId] = recentlyViewedStore[userId].filter(
        (recipeId) => recipeId !== id
      );
    });

    return HttpResponse.json({
      message: "Recipe deleted successfully.",
      recipeId: id,
    });
  }),

  // GET /api/recipes/tags - Get all available tags
  http.get("/api/recipes/tags", ({ request }) => {
    const currentUser = getCurrentUser(request);

    // Get tags from recipes user can access
    const accessibleRecipes = recipesStore.filter((recipe) =>
      canAccessRecipe(recipe, currentUser.id, currentUser.email)
    );

    const tags = Array.from(
      new Set(accessibleRecipes.flatMap((recipe) => recipe.tags))
    ).sort();

    return HttpResponse.json(tags);
  }),

  // GET /api/user/collections - Get user's recipe collections
  http.get("/api/user/collections", ({ request }) => {
    const currentUser = getCurrentUser(request);

    const userCollections = collectionsStore[currentUser.id] || [];
    const collectionRecipes = recipesStore.filter((recipe) =>
      userCollections.includes(recipe._id)
    );

    return HttpResponse.json(collectionRecipes);
  }),

  // POST /api/user/collections - Add recipe to collection
  http.post("/api/user/collections", async ({ request }) => {
    const currentUser = getCurrentUser(request);

    try {
      const { recipeId } = (await request.json()) as { recipeId: string };

      if (!recipeId) {
        return HttpResponse.json(
          { message: "Recipe ID is required" },
          { status: 400 }
        );
      }

      // Check if recipe exists
      const recipe = recipesStore.find((r) => r._id === recipeId);
      if (!recipe) {
        return HttpResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }

      // Add to user's collections
      if (!collectionsStore[currentUser.id]) {
        collectionsStore[currentUser.id] = [];
      }

      if (!collectionsStore[currentUser.id].includes(recipeId)) {
        collectionsStore[currentUser.id].push(recipeId);
      }

      return HttpResponse.json(
        { message: "Recipe added to collection" },
        { status: 201 }
      );
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // GET /api/user/recentlyViewed - Get recently viewed recipes
  http.get("/api/user/recentlyViewed", ({ request }) => {
    const currentUser = getCurrentUser(request);

    const recentlyViewedIds = recentlyViewedStore[currentUser.id] || [];
    const recentlyViewedRecipes = recentlyViewedIds
      .map((id) => recipesStore.find((recipe) => recipe._id === id))
      .filter(Boolean)
      .reverse(); // Most recent first

    return HttpResponse.json(recentlyViewedRecipes);
  }),

  // DELETE /api/user/recentlyViewed - Clear recently viewed
  http.delete("/api/user/recentlyViewed", ({ request }) => {
    const currentUser = getCurrentUser(request);

    recentlyViewedStore[currentUser.id] = [];

    return HttpResponse.json({
      message: "Recently viewed recipes cleared",
    });
  }),

  // GET /api/user/sharing - Get shared users
  http.get("/api/user/sharing", ({ request }) => {
    const currentUser = getCurrentUser(request);

    const sharedWithUsers = sharedUsersStore[currentUser.id] || [];

    return HttpResponse.json({ sharedWithUsers });
  }),

  // POST /api/user/sharing - Share with user
  http.post("/api/user/sharing", async ({ request }) => {
    const currentUser = getCurrentUser(request);

    try {
      const { shareWithEmail } = (await request.json()) as {
        shareWithEmail: string;
      };

      if (!shareWithEmail) {
        return HttpResponse.json(
          { message: "Email is required" },
          { status: 400 }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(shareWithEmail)) {
        return HttpResponse.json(
          { message: "Invalid email format" },
          { status: 400 }
        );
      }

      // Prevent sharing with yourself
      if (shareWithEmail.toLowerCase() === currentUser.email.toLowerCase()) {
        return HttpResponse.json(
          { message: "Cannot share with yourself" },
          { status: 400 }
        );
      }

      // Check if target user exists
      const targetUser = Object.values(mockUsers).find(
        (user) => user.email.toLowerCase() === shareWithEmail.toLowerCase()
      );

      if (!targetUser) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Add to shared users
      if (!sharedUsersStore[currentUser.id]) {
        sharedUsersStore[currentUser.id] = [];
      }

      if (!sharedUsersStore[currentUser.id].includes(shareWithEmail)) {
        sharedUsersStore[currentUser.id].push(shareWithEmail);
      }

      return HttpResponse.json({
        message: "Recipe book shared successfully",
      });
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }),

  // DELETE /api/user/sharing - Remove shared user
  http.delete("/api/user/sharing", async ({ request }) => {
    const currentUser = getCurrentUser(request);

    try {
      const { shareWithEmail } = (await request.json()) as {
        shareWithEmail: string;
      };

      if (!sharedUsersStore[currentUser.id]) {
        return HttpResponse.json(
          { message: "User not in your shared list" },
          { status: 404 }
        );
      }

      const sharedUsers = sharedUsersStore[currentUser.id];
      const userIndex = sharedUsers.indexOf(shareWithEmail);

      if (userIndex === -1) {
        return HttpResponse.json(
          { message: "User not in your shared list" },
          { status: 404 }
        );
      }

      sharedUsers.splice(userIndex, 1);

      return HttpResponse.json({
        message: "Access removed successfully",
      });
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }),

  // POST /api/ai/processRecipe - AI recipe processing
  http.post("/api/ai/processRecipe", async ({ request }) => {
    try {
      const { htmlContent } = (await request.json()) as { htmlContent: string };

      if (!htmlContent || typeof htmlContent !== "string") {
        return HttpResponse.json(
          { message: "Missing or invalid htmlContent in request body" },
          { status: 400 }
        );
      }

      // Mock AI processing - just return processed content
      const processedContent = htmlContent
        .replace(/cups?/g, "ml")
        .replace(/tbsp/g, "ml");

      return HttpResponse.json({ processedContent });
    } catch (_error) {
      return HttpResponse.json(
        {
          message:
            "Error processing recipe: Server error during recipe conversion",
        },
        { status: 500 }
      );
    }
  }),
];

// Reset function for test isolation
export const resetMockData = () => {
  recipesStore = [...mockRecipes];
  collectionsStore = { ...mockCollections };
  recentlyViewedStore = { ...mockRecentlyViewed };
  sharedUsersStore = { ...mockSharedUsers };
};

// Helper to get current state for testing
export const getMockState = () => ({
  recipes: recipesStore,
  collections: collectionsStore,
  recentlyViewed: recentlyViewedStore,
  sharedUsers: sharedUsersStore,
});
