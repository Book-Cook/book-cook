/**
 * POST /api/user/collections responses
 */
export const PostUserCollectionsResponses = {
  success: {
    added: {
      message: "Recipe added to collection",
      status: 201,
    },
  },

  errors: {
    missingRecipeId: {
      message: "Recipe ID is required",
      status: 400,
    },
    recipeNotFound: {
      message: "Recipe not found",
      status: 404,
    },
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
