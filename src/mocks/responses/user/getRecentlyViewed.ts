import { chocolateChipCookies, caesarSalad } from "../../data/recipes";

/**
 * GET /api/user/recentlyViewed responses
 */
export const GetRecentlyViewedResponses = {
  success: {
    withRecipes: [caesarSalad, chocolateChipCookies],
    empty: [],
  },

  errors: {
    notFound: {
      message: "Recently viewed recipes not found",
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
