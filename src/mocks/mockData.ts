import type { Recipe } from "../clientToServer/types";

// Mock user data
export const mockUsers = {
  testUser: {
    id: "user_123",
    email: "test@example.com",
    name: "Test User",
  },
  sharedUser: {
    id: "user_456",
    email: "shared@example.com",
    name: "Shared User",
  },
};

// Mock recipe data with realistic content
export const mockRecipes: Recipe[] = [
  {
    _id: "recipe_001",
    title: "Classic Chocolate Chip Cookies",
    data: `
## Ingredients
- 2¼ cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- ¾ cup granulated sugar
- ¾ cup packed brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

## Instructions
1. Preheat oven to 375°F (190°C)
2. Mix flour, baking soda and salt in bowl
3. Beat butter and sugars until creamy
4. Add eggs and vanilla; beat well
5. Gradually blend in flour mixture
6. Stir in chocolate chips
7. Drop by rounded tablespoons onto ungreased cookie sheets
8. Bake 9-11 minutes or until golden brown
    `,
    tags: ["dessert", "cookies", "chocolate", "baking"],
    emoji: "🍪",
    imageURL: "https://example.com/cookies.jpg",
    owner: mockUsers.testUser.id,
    isPublic: true,
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "recipe_002",
    title: "Spicy Thai Green Curry",
    data: `
## Ingredients
- 400ml coconut milk
- 2 tbsp green curry paste
- 500g chicken breast, sliced
- 1 eggplant, cubed
- 100g green beans
- 2 kaffir lime leaves
- 1 tbsp fish sauce
- 1 tbsp palm sugar
- Thai basil leaves

## Instructions
1. Heat half the coconut milk in a wok
2. Add curry paste and fry until fragrant
3. Add chicken and cook until done
4. Add vegetables and remaining coconut milk
5. Season with fish sauce and palm sugar
6. Garnish with basil leaves
    `,
    tags: ["thai", "curry", "spicy", "chicken", "main-course"],
    emoji: "🍛",
    imageURL: "https://example.com/curry.jpg",
    owner: mockUsers.testUser.id,
    isPublic: false,
    createdAt: "2024-02-20T14:15:00.000Z",
  },
  {
    _id: "recipe_003",
    title: "Fresh Caesar Salad",
    data: `
## Ingredients
- 1 large romaine lettuce head
- ½ cup parmesan cheese, grated
- ¼ cup croutons
- 2 anchovy fillets
- 2 garlic cloves
- 1 egg yolk
- 2 tbsp lemon juice
- ¼ cup olive oil
- Salt and pepper to taste

## Instructions
1. Wash and chop romaine lettuce
2. Make dressing by whisking egg yolk, lemon juice, garlic, and anchovies
3. Slowly drizzle in olive oil while whisking
4. Toss lettuce with dressing
5. Top with parmesan and croutons
    `,
    tags: ["salad", "vegetarian", "healthy", "quick"],
    emoji: "🥗",
    imageURL: "https://example.com/caesar.jpg",
    owner: mockUsers.sharedUser.id,
    isPublic: true,
    createdAt: "2024-03-10T09:45:00.000Z",
  },
];

// Mock collections data
export const mockCollections = {
  [mockUsers.testUser.id]: ["recipe_001", "recipe_003"],
  [mockUsers.sharedUser.id]: ["recipe_002"],
};

// Mock recently viewed recipes
export const mockRecentlyViewed = {
  [mockUsers.testUser.id]: ["recipe_002", "recipe_001"],
  [mockUsers.sharedUser.id]: ["recipe_003"],
};

// Mock shared users data
export const mockSharedUsers = {
  [mockUsers.testUser.id]: [mockUsers.sharedUser.email],
  [mockUsers.sharedUser.id]: [],
};

// Mock tags extracted from recipes
export const mockTags = Array.from(
  new Set(mockRecipes.flatMap((recipe) => recipe.tags))
).sort();

// Helper functions for generating dynamic data
export const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  _id: `recipe_${Date.now()}`,
  title: "Mock Recipe",
  data: "## Mock recipe content",
  tags: ["mock"],
  emoji: "🍽️",
  imageURL: "",
  owner: mockUsers.testUser.id,
  isPublic: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const getRecipesByUser = (userId: string): Recipe[] => {
  return mockRecipes.filter((recipe) => recipe.owner === userId);
};

export const getPublicRecipes = (): Recipe[] => {
  return mockRecipes.filter((recipe) => recipe.isPublic);
};

export const getRecipesByTags = (tags: string[]): Recipe[] => {
  if (tags.length === 0) {
    return mockRecipes;
  }
  return mockRecipes.filter((recipe) =>
    tags.some((tag) => recipe.tags.includes(tag))
  );
};

export const searchRecipes = (query: string): Recipe[] => {
  if (!query.trim()) {
    return mockRecipes;
  }
  const searchTerm = query.toLowerCase();
  return mockRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.data.toLowerCase().includes(searchTerm) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
};

export const sortRecipes = (
  recipes: Recipe[],
  sortProperty: string,
  sortDirection: string
): Recipe[] => {
  const sorted = [...recipes].sort((a, b) => {
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

  return sorted;
};
