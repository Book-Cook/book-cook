/**
 * DELETE /api/user/sharing responses
 */
export const DeleteUserSharingResponses = {
  success: {
    removed: {
      message: "Access removed successfully",
      status: 200,
    },
  },

  errors: {
    userNotInList: {
      message: "User not in your shared list",
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
