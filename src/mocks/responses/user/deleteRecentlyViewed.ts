/**
 * DELETE /api/user/recentlyViewed responses
 */
export const DeleteRecentlyViewedResponses = {
  success: {
    cleared: {
      message: "Recently viewed recipes cleared",
      status: 200,
    },
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
