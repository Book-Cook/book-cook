/**
 * DELETE /api/recipes/:id responses
 */
export const DeleteRecipeResponses = {
  success: {
    deleted: {
      message: "Recipe deleted successfully.",
      recipeId: "recipe_123",
      status: 200,
    },
  },

  errors: {
    notFound: {
      message: "Recipe not found.",
      status: 404,
    },
    unauthorized: {
      message: "Not authorized to delete this recipe",
      status: 403,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
