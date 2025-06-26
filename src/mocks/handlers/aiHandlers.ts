import { http, HttpResponse } from "msw";

/**
 * Clean handlers for AI-related operations
 */
export const createAIHandlers = () => [
  // POST /api/ai/processRecipe - AI recipe processing
  http.post("/api/ai/processRecipe", async ({ request }) => {
    try {
      const { htmlContent } = (await request.json()) as { htmlContent: string };

      if (!htmlContent || typeof htmlContent !== "string") {
        return HttpResponse.json(
          { message: "Missing or invalid htmlContent in request body" },
          { status: 400 }
        );
      }

      // Mock AI processing - convert measurements
      const processedContent = htmlContent
        .replace(
          /\b(\d+(?:\.\d+)?)\s*cups?\b/gi,
          (match, num) => `${Math.round(parseFloat(num) * 240)}ml`
        )
        .replace(
          /\b(\d+(?:\.\d+)?)\s*tbsp\b/gi,
          (match, num) => `${Math.round(parseFloat(num) * 15)}ml`
        )
        .replace(
          /\b(\d+(?:\.\d+)?)\s*tsp\b/gi,
          (match, num) => `${Math.round(parseFloat(num) * 5)}ml`
        )
        .replace(
          /\b(\d+(?:\.\d+)?)\s*oz\b/gi,
          (match, num) => `${Math.round(parseFloat(num) * 28)}g`
        );

      return HttpResponse.json({ processedContent });
    } catch (_error) {
      return HttpResponse.json(
        {
          message:
            "Error processing recipe: Server error during recipe conversion",
        },
        { status: 500 }
      );
    }
  }),
];
