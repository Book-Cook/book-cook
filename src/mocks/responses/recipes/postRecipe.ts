/**
 * POST /api/recipes responses
 */
export const PostRecipeResponses = {
  success: {
    created: {
      message: "Recipe uploaded successfully.",
      recipeId: "recipe_new_123",
      status: 201,
    },
  },

  errors: {
    missingTitle: {
      message: "Title required.",
      status: 400,
    },
    unauthorized: {
      message: "Unauthorized. Please log in to create a recipe.",
      status: 401,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
