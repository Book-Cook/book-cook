import { chocolateChipCookies, thaiGreenCurry } from "../../data/recipes";

/**
 * GET /api/user/collections responses
 */
export const GetUserCollectionsResponses = {
  success: {
    withRecipes: [chocolateChipCookies, thaiGreenCurry],
    empty: [],
  },

  errors: {
    notFound: {
      message: "Collections not found",
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
