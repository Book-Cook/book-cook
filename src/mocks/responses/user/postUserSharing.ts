/**
 * POST /api/user/sharing responses
 */
export const PostUserSharingResponses = {
  success: {
    shared: {
      message: "Recipe book shared successfully",
      status: 200,
    },
  },

  errors: {
    emailRequired: {
      message: "Email is required",
      status: 400,
    },
    invalidEmail: {
      message: "Invalid email format",
      status: 400,
    },
    cannotShareWithSelf: {
      message: "Cannot share with yourself",
      status: 400,
    },
    userNotFound: {
      message: "User not found",
      status: 404,
    },
    unauthorized: {
      message: "Unauthorized",
      status: 401,
    },
    serverError: {
      message: "Internal server error",
      status: 500,
    },
  },
};
