import { chocolateChipCookies } from "../../data/recipes";

/**
 * GET /api/recipes/:id responses
 */
export const GetRecipeByIdResponses = {
  success: {
    found: chocolateChipCookies,
  },

  errors: {
    notFound: {
      message: "Recipe not found",
      status: 404,
    },
    unauthorized: {
      message: "Not authorized to view this recipe",
      status: 403,
    },
    invalidId: {
      message: "Invalid recipe ID",
      status: 400,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
