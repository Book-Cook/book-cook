/**
 * GET /api/recipes/tags responses
 */
export const GetRecipeTagsResponses = {
  success: {
    available: ["baking", "dessert", "healthy", "quick", "vegetarian"],
    filtered: ["dessert", "chocolate"],
    empty: [],
  },

  errors: {
    unauthorized: {
      message: "Unauthorized",
      status: 401,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
