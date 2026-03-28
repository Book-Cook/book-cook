/**
 * GET /api/user/sharing responses
 */
export const GetUserSharingResponses = {
  success: {
    withUsers: {
      sharedWithUsers: ["collaborator@example.com", "viewer@example.com"],
      status: 200,
    },
    empty: {
      sharedWithUsers: [],
      status: 200,
    },
  },

  errors: {
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
