import { SampleData } from "../factories";
// import { TestUsers } from "../factories";

import type { Recipe } from "../../clientToServer/types";

/**
 * Centralized data store with clean state management
 */
export class DataStore {
  private recipes: Recipe[] = [];
  private collections: Record<string, string[]> = {};
  private recentlyViewed: Record<string, string[]> = {};
  private sharedUsers: Record<string, string[]> = {};

  constructor() {
    this.reset();
  }

  // Recipe operations
  getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipes.find((r) => r._id === id);
  }

  addRecipe(recipe: Recipe): Recipe {
    this.recipes.push(recipe);
    return recipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe | undefined {
    const index = this.recipes.findIndex((r) => r._id === id);
    if (index === -1) {
      return undefined;
    }

    this.recipes[index] = { ...this.recipes[index], ...updates };
    return this.recipes[index];
  }

  deleteRecipe(id: string): boolean {
    const index = this.recipes.findIndex((r) => r._id === id);
    if (index === -1) {
      return false;
    }

    this.recipes.splice(index, 1);

    // Clean up references
    this.removeFromAllCollections(id);
    this.removeFromAllRecentlyViewed(id);

    return true;
  }

  // Collection operations
  getUserCollections(userId: string): string[] {
    return this.collections[userId] || [];
  }

  addToCollection(userId: string, recipeId: string): void {
    if (!this.collections[userId]) {
      this.collections[userId] = [];
    }
    if (!this.collections[userId].includes(recipeId)) {
      this.collections[userId].push(recipeId);
    }
  }

  removeFromCollection(userId: string, recipeId: string): void {
    if (this.collections[userId]) {
      this.collections[userId] = this.collections[userId].filter(
        (id) => id !== recipeId
      );
    }
  }

  private removeFromAllCollections(recipeId: string): void {
    Object.keys(this.collections).forEach((userId) => {
      this.removeFromCollection(userId, recipeId);
    });
  }

  // Recently viewed operations
  getRecentlyViewed(userId: string): string[] {
    return this.recentlyViewed[userId] || [];
  }

  addToRecentlyViewed(userId: string, recipeId: string): void {
    if (!this.recentlyViewed[userId]) {
      this.recentlyViewed[userId] = [];
    }

    const recent = this.recentlyViewed[userId];
    const existingIndex = recent.indexOf(recipeId);

    if (existingIndex > -1) {
      recent.splice(existingIndex, 1);
    }

    recent.push(recipeId);

    // Keep only last 10 items
    if (recent.length > 10) {
      recent.splice(0, recent.length - 10);
    }
  }

  clearRecentlyViewed(userId: string): void {
    this.recentlyViewed[userId] = [];
  }

  private removeFromAllRecentlyViewed(recipeId: string): void {
    Object.keys(this.recentlyViewed).forEach((userId) => {
      if (this.recentlyViewed[userId]) {
        this.recentlyViewed[userId] = this.recentlyViewed[userId].filter(
          (id) => id !== recipeId
        );
      }
    });
  }

  // Sharing operations
  getSharedUsers(userId: string): string[] {
    return this.sharedUsers[userId] || [];
  }

  addSharedUser(userId: string, email: string): void {
    if (!this.sharedUsers[userId]) {
      this.sharedUsers[userId] = [];
    }
    if (!this.sharedUsers[userId].includes(email)) {
      this.sharedUsers[userId].push(email);
    }
  }

  removeSharedUser(userId: string, email: string): boolean {
    if (!this.sharedUsers[userId]) {
      return false;
    }

    const index = this.sharedUsers[userId].indexOf(email);
    if (index === -1) {
      return false;
    }

    this.sharedUsers[userId].splice(index, 1);
    return true;
  }

  // Utility methods
  reset(): void {
    this.recipes = [...SampleData.recipes];
    this.collections = { ...SampleData.collections };
    this.recentlyViewed = { ...SampleData.recentlyViewed };
    this.sharedUsers = { ...SampleData.sharedUsers };
  }

  getState() {
    return {
      recipes: this.getRecipes(),
      collections: { ...this.collections },
      recentlyViewed: { ...this.recentlyViewed },
      sharedUsers: { ...this.sharedUsers },
    };
  }
}
