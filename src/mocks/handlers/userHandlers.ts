import { http, HttpResponse } from "msw";

import { AuthService } from "../services/AuthService";
import type { DataStore } from "../store/DataStore";

/**
 * Clean handlers for user-related operations
 */
export const createUserHandlers = (store: DataStore) => [
  // GET /api/user/collections - Get user's recipe collections
  http.get("/api/user/collections", ({ request }) => {
    const user = AuthService.getCurrentUser(request);

    try {
      const collectionIds = store.getUserCollections(user.id);
      const recipes = collectionIds
        .map((id) => store.getRecipeById(id))
        .filter(Boolean);

      return HttpResponse.json(recipes);
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // POST /api/user/collections - Add recipe to collection
  http.post("/api/user/collections", async ({ request }) => {
    const user = AuthService.getCurrentUser(request);

    try {
      const { recipeId } = (await request.json()) as { recipeId: string };

      if (!recipeId) {
        return HttpResponse.json(
          { message: "Recipe ID is required" },
          { status: 400 }
        );
      }

      const recipe = store.getRecipeById(recipeId);
      if (!recipe) {
        return HttpResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }

      store.addToCollection(user.id, recipeId);

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
    const user = AuthService.getCurrentUser(request);

    try {
      const recentIds = store.getRecentlyViewed(user.id);
      const recipes = recentIds
        .map((id) => store.getRecipeById(id))
        .filter(Boolean)
        .reverse(); // Most recent first

      return HttpResponse.json(recipes);
    } catch (_error) {
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // DELETE /api/user/recentlyViewed - Clear recently viewed
  http.delete("/api/user/recentlyViewed", ({ request }) => {
    const user = AuthService.getCurrentUser(request);

    store.clearRecentlyViewed(user.id);

    return HttpResponse.json({
      message: "Recently viewed recipes cleared",
    });
  }),

  // GET /api/user/sharing - Get shared users
  http.get("/api/user/sharing", ({ request }) => {
    const user = AuthService.getCurrentUser(request);
    const sharedWithUsers = store.getSharedUsers(user.id);

    return HttpResponse.json({ sharedWithUsers });
  }),

  // POST /api/user/sharing - Share with user
  http.post("/api/user/sharing", async ({ request }) => {
    const user = AuthService.getCurrentUser(request);

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
      if (shareWithEmail.toLowerCase() === user.email.toLowerCase()) {
        return HttpResponse.json(
          { message: "Cannot share with yourself" },
          { status: 400 }
        );
      }

      store.addSharedUser(user.id, shareWithEmail);

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
    const user = AuthService.getCurrentUser(request);

    try {
      const { shareWithEmail } = (await request.json()) as {
        shareWithEmail: string;
      };

      const removed = store.removeSharedUser(user.id, shareWithEmail);

      if (!removed) {
        return HttpResponse.json(
          { message: "User not in your shared list" },
          { status: 404 }
        );
      }

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
];
