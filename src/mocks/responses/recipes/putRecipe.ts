/**
 * PUT /api/recipes/:id responses
 */
export const PutRecipeResponses = {
  success: {
    updated: {
      message: "Recipe updated successfully",
      status: 200,
    },
  },

  errors: {
    notFound: {
      message: "Recipe not found",
      status: 404,
    },
    unauthorized: {
      message: "Not authorized to update this recipe",
      status: 403,
    },
    validationError: {
      message: "Invalid recipe data",
      status: 400,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
