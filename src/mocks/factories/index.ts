import type { Recipe } from "../../clientToServer/types";

/**
 * Base factory for creating mock recipes with sensible defaults
 */
export class RecipeFactory {
  private static idCounter = 1;

  static create(overrides: Partial<Recipe> = {}): Recipe {
    const id = `recipe_${String(this.idCounter++).padStart(3, "0")}`;

    return {
      _id: id,
      title: "Sample Recipe",
      data: "## Ingredients\n- Sample ingredient\n\n## Instructions\n1. Sample instruction",
      tags: ["sample"],
      emoji: "🍽️",
      imageURL: "",
      owner: "user_123",
      isPublic: false,
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createBatch(count: number, overrides: Partial<Recipe> = {}): Recipe[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static reset() {
    this.idCounter = 1;
  }
}

/**
 * Predefined recipe templates for common test scenarios
 */
export const RecipeTemplates = {
  public: () =>
    RecipeFactory.create({
      title: "Public Recipe",
      isPublic: true,
      tags: ["public", "popular"],
    }),

  private: () =>
    RecipeFactory.create({
      title: "Private Recipe",
      isPublic: false,
      tags: ["private", "personal"],
    }),

  withTags: (tags: string[]) =>
    RecipeFactory.create({
      title: `Recipe with ${tags.join(", ")}`,
      tags,
    }),

  dessert: () =>
    RecipeFactory.create({
      title: "Chocolate Cake",
      tags: ["dessert", "chocolate", "baking"],
      emoji: "🍰",
      data: "## Ingredients\n- Chocolate\n- Flour\n- Sugar\n\n## Instructions\n1. Mix ingredients\n2. Bake at 350°F",
    }),

  mainCourse: () =>
    RecipeFactory.create({
      title: "Grilled Chicken",
      tags: ["main-course", "chicken", "grilled"],
      emoji: "🍗",
      data: "## Ingredients\n- Chicken breast\n- Seasonings\n\n## Instructions\n1. Season chicken\n2. Grill for 6 minutes per side",
    }),
};

/**
 * User factory for creating test users
 */
export class UserFactory {
  static create(
    overrides: Partial<{ id: string; email: string; name: string }> = {}
  ) {
    const id = `user_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      email: `test-${id}@example.com`,
      name: `Test User ${id}`,
      ...overrides,
    };
  }

  static createBatch(count: number) {
    return Array.from({ length: count }, () => this.create());
  }
}

/**
 * Predefined users for consistent testing
 */
export const TestUsers = {
  owner: UserFactory.create({
    id: "user_owner",
    email: "owner@example.com",
    name: "Recipe Owner",
  }),

  collaborator: UserFactory.create({
    id: "user_collaborator",
    email: "collaborator@example.com",
    name: "Recipe Collaborator",
  }),

  viewer: UserFactory.create({
    id: "user_viewer",
    email: "viewer@example.com",
    name: "Recipe Viewer",
  }),
};

/**
 * Sample dataset for common test scenarios
 */
export const SampleData = {
  recipes: [
    RecipeTemplates.dessert(),
    RecipeTemplates.mainCourse(),
    RecipeTemplates.public(),
    RecipeTemplates.private(),
  ],

  users: Object.values(TestUsers),

  collections: {
    [TestUsers.owner.id]: ["recipe_001", "recipe_002"],
    [TestUsers.collaborator.id]: ["recipe_003"],
  },

  recentlyViewed: {
    [TestUsers.owner.id]: ["recipe_002", "recipe_001"],
    [TestUsers.viewer.id]: ["recipe_003"],
  },

  sharedUsers: {
    [TestUsers.owner.id]: [TestUsers.collaborator.email],
    [TestUsers.collaborator.id]: [],
  },
};
