import { RecipeFactory } from "../factories";
import type { DataStore } from "../store/DataStore";

import type { Recipe } from "../../clientToServer/types";

export interface QueryParams {
  search?: string;
  sortProperty?: string;
  sortDirection?: string;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Business logic service for recipe operations
 */
export class RecipeService {
  // Custom error classes for clean error handling
  static ValidationError = class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ValidationError";
    }
  };

  static NotFoundError = class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
    }
  };

  static UnauthorizedError = class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "UnauthorizedError";
    }
  };

  /**
   * Parse and validate query parameters from URL
   */
  static parseQueryParams(url: string): QueryParams {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    const sortProperty = params.get("sortProperty") || "createdAt";
    const sortDirection = params.get("sortDirection") || "desc";

    // Validation
    const validSortProperties = ["createdAt", "title"];
    const validDirections = ["asc", "desc"];

    if (
      !validSortProperties.includes(sortProperty) ||
      !validDirections.includes(sortDirection)
    ) {
      throw new Error("Invalid sorting parameters");
    }

    return {
      search: params.get("search") || "",
      sortProperty,
      sortDirection,
      tags: params.getAll("tags"),
    };
  }

  /**
   * Get filtered and sorted recipes based on user access
   */
  static getFilteredRecipes(
    store: DataStore,
    user: User,
    params: QueryParams
  ): Recipe[] {
    let recipes = store.getRecipes();

    // Filter by access permissions
    recipes = recipes.filter((recipe) =>
      this.canUserAccessRecipe(store, recipe, user)
    );

    // Apply search filter
    if (params.search) {
      recipes = this.searchRecipes(recipes, params.search);
    }

    // Apply tag filters
    if (params.tags && params.tags.length > 0) {
      recipes = this.filterByTags(recipes, params.tags);
    }

    // Apply sorting
    return this.sortRecipes(
      recipes,
      params.sortProperty!,
      params.sortDirection!
    );
  }

  /**
   * Create a new recipe
   */
  static createRecipe(
    store: DataStore,
    userId: string,
    data: Partial<Recipe>
  ): Recipe {
    if (!data.title?.trim()) {
      throw new this.ValidationError("Title required.");
    }

    const recipe = RecipeFactory.create({
      title: data.title.trim(),
      data: data.data || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      imageURL: data.imageURL || "",
      emoji: data.emoji || "🍽️",
      owner: userId,
      isPublic: data.isPublic || false,
    });

    return store.addRecipe(recipe);
  }

  /**
   * Get recipe by ID with access control
   */
  static getRecipeById(store: DataStore, recipeId: string, user: User): Recipe {
    const recipe = store.getRecipeById(recipeId);

    if (!recipe) {
      throw new this.NotFoundError("Recipe not found");
    }

    if (!this.canUserAccessRecipe(store, recipe, user)) {
      throw new this.UnauthorizedError("Not authorized to view this recipe");
    }

    return recipe;
  }

  /**
   * Update recipe with authorization check
   */
  static updateRecipe(
    store: DataStore,
    recipeId: string,
    user: User,
    updates: Partial<Recipe>
  ): Recipe {
    const recipe = store.getRecipeById(recipeId);

    if (!recipe) {
      throw new this.NotFoundError("Recipe not found");
    }

    if (!this.canUserModifyRecipe(store, recipe, user)) {
      throw new this.UnauthorizedError("Not authorized to update this recipe");
    }

    // Prevent changes to protected fields
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates._id;
    delete sanitizedUpdates.owner;
    delete sanitizedUpdates.createdAt;

    const updatedRecipe = store.updateRecipe(recipeId, sanitizedUpdates);
    if (!updatedRecipe) {
      throw new this.NotFoundError("Recipe not found");
    }

    return updatedRecipe;
  }

  /**
   * Delete recipe with authorization check
   */
  static deleteRecipe(store: DataStore, recipeId: string, user: User): void {
    const recipe = store.getRecipeById(recipeId);

    if (!recipe) {
      throw new this.NotFoundError("Recipe not found");
    }

    if (!this.canUserModifyRecipe(store, recipe, user)) {
      throw new this.UnauthorizedError("Not authorized to delete this recipe");
    }

    store.deleteRecipe(recipeId);
  }

  /**
   * Get available tags for user-accessible recipes
   */
  static getAvailableTags(store: DataStore, user: User): string[] {
    const recipes = store
      .getRecipes()
      .filter((recipe) => this.canUserAccessRecipe(store, recipe, user));

    const tags = Array.from(
      new Set(recipes.flatMap((recipe) => recipe.tags))
    ).sort();

    return tags;
  }

  /**
   * Add recipe to user's recently viewed
   */
  static addToRecentlyViewed(
    store: DataStore,
    userId: string,
    recipeId: string
  ): void {
    store.addToRecentlyViewed(userId, recipeId);
  }

  // Private helper methods
  private static canUserAccessRecipe(
    store: DataStore,
    recipe: Recipe,
    user: User
  ): boolean {
    // Public recipes are accessible to everyone
    if (recipe.isPublic) {
      return true;
    }

    // Owner can always access
    if (recipe.owner === user.id) {
      return true;
    }

    // Check if recipe owner has shared with current user
    const ownerSharedUsers = store.getSharedUsers(recipe.owner);
    return ownerSharedUsers.includes(user.email);
  }

  private static canUserModifyRecipe(
    store: DataStore,
    recipe: Recipe,
    user: User
  ): boolean {
    // Owner can always modify
    if (recipe.owner === user.id) {
      return true;
    }

    // Check if recipe owner has shared with current user
    const ownerSharedUsers = store.getSharedUsers(recipe.owner);
    return ownerSharedUsers.includes(user.email);
  }

  private static searchRecipes(recipes: Recipe[], query: string): Recipe[] {
    if (!query.trim()) {
      return recipes;
    }

    const searchTerm = query.toLowerCase();
    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.data.toLowerCase().includes(searchTerm) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  private static filterByTags(recipes: Recipe[], tags: string[]): Recipe[] {
    return recipes.filter((recipe) =>
      tags.some((tag) => recipe.tags.includes(tag))
    );
  }

  private static sortRecipes(
    recipes: Recipe[],
    sortProperty: string,
    sortDirection: string
  ): Recipe[] {
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
  }
}
