import { http, HttpResponse } from "msw";

import { AuthService } from "../services/AuthService";
import { RecipeService } from "../services/RecipeService";
import type { DataStore } from "../store/DataStore";

import type { Recipe } from "../../clientToServer/types";

/**
 * Clean, focused handlers for recipe-related API endpoints
 */
export const createRecipeHandlers = (store: DataStore) => [
  // GET /api/recipes - List recipes with filtering
  http.get("/api/recipes", ({ request }) => {
    const user = AuthService.getCurrentUser(request);
    const params = RecipeService.parseQueryParams(request.url);

    try {
      const recipes = RecipeService.getFilteredRecipes(store, user, params);
      return HttpResponse.json(recipes);
    } catch (_error) {
      return HttpResponse.json(
        { message: "Invalid sorting parameters." },
        { status: 400 }
      );
    }
  }),

  // POST /api/recipes - Create new recipe
  http.post("/api/recipes", async ({ request }) => {
    const user = AuthService.getCurrentUser(request);

    try {
      const data = (await request.json()) as Partial<Recipe>;
      const recipe = RecipeService.createRecipe(store, user.id, data);

      return HttpResponse.json(
        {
          message: "Recipe uploaded successfully.",
          recipeId: recipe._id,
        },
        { status: 201 }
      );
    } catch (_error) {
      if (_error instanceof RecipeService.ValidationError) {
        return HttpResponse.json({ message: _error.message }, { status: 400 });
      }
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // GET /api/recipes/:id - Get specific recipe
  http.get("/api/recipes/:id", ({ params, request }) => {
    const user = AuthService.getCurrentUser(request);
    const recipeId = params.id as string;

    try {
      const recipe = RecipeService.getRecipeById(store, recipeId, user);
      RecipeService.addToRecentlyViewed(store, user.id, recipeId);

      return HttpResponse.json(recipe);
    } catch (_error) {
      if (_error instanceof RecipeService.NotFoundError) {
        return HttpResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }
      if (_error instanceof RecipeService.UnauthorizedError) {
        return HttpResponse.json(
          { message: "Not authorized to view this recipe" },
          { status: 403 }
        );
      }
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // PUT /api/recipes/:id - Update recipe
  http.put("/api/recipes/:id", async ({ params, request }) => {
    const user = AuthService.getCurrentUser(request);
    const recipeId = params.id as string;

    try {
      const updates = (await request.json()) as Partial<Recipe>;
      RecipeService.updateRecipe(store, recipeId, user, updates);

      return HttpResponse.json({
        message: "Recipe updated successfully",
      });
    } catch (_error) {
      if (_error instanceof RecipeService.NotFoundError) {
        return HttpResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }
      if (_error instanceof RecipeService.UnauthorizedError) {
        return HttpResponse.json(
          { message: "Not authorized to update this recipe" },
          { status: 403 }
        );
      }
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // DELETE /api/recipes/:id - Delete recipe
  http.delete("/api/recipes/:id", ({ params, request }) => {
    const user = AuthService.getCurrentUser(request);
    const recipeId = params.id as string;

    try {
      RecipeService.deleteRecipe(store, recipeId, user);

      return HttpResponse.json({
        message: "Recipe deleted successfully.",
        recipeId,
      });
    } catch (_error) {
      if (_error instanceof RecipeService.NotFoundError) {
        return HttpResponse.json(
          { message: "Recipe not found." },
          { status: 404 }
        );
      }
      if (_error instanceof RecipeService.UnauthorizedError) {
        return HttpResponse.json(
          { message: "Not authorized to delete this recipe" },
          { status: 403 }
        );
      }
      return HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }),

  // GET /api/recipes/tags - Get available tags
  http.get("/api/recipes/tags", ({ request }) => {
    const user = AuthService.getCurrentUser(request);
    const tags = RecipeService.getAvailableTags(store, user);

    return HttpResponse.json(tags);
  }),
];
