/**
 * POST /api/ai/processRecipe responses
 */
export const PostProcessRecipeResponses = {
  success: {
    processed: {
      processedContent:
        "## Ingredients\n- 240ml milk\n- 15ml vanilla extract\n- 28g butter",
      status: 200,
    },
  },

  errors: {
    missingContent: {
      message: "Missing or invalid htmlContent in request body",
      status: 400,
    },
    serverError: {
      message: "Error processing recipe: Server error during recipe conversion",
      status: 500,
    },
  },
};
