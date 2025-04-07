import { NextRequest, NextResponse } from "next/server";
import { generateText, LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "edge";

const measurementConversionPrompt = `
You are an HTML transformation tool. Your task is to process the input HTML recipe content.
Find measurements in 'cups', 'cup', 'tbsp', 'tablespoon', 'tsp', 'teaspoon'.
Convert them to grams (g) using these common factors:
- 1 cup flour ≈ 120g
- 1 cup sugar ≈ 200g
- 1 cup butter ≈ 227g
- 1 cup liquid ≈ 240g
- 1 tbsp flour ≈ 8g
- 1 tbsp sugar ≈ 12g
- 1 tbsp butter ≈ 14g
- 1 tsp salt ≈ 6g
- 1 tsp butter ≈ 5g // Added specific example from your test case
- Add other common tsp/tbsp conversions if needed.

Modify the HTML *in-place*, adding the gram equivalent in parentheses like this: "1 cup flour" becomes "1 cup (approx. 120g) flour".

Rules:
1. Modify directly within existing HTML tags.
2. If a line seems to already have grams, leave it alone.
3. Output ONLY the complete, modified HTML content. No explanations, no introductions, no text outside the HTML.
`;

export default async function handler(req: NextRequest) {
  // 1. Check Method
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    // 2. Parse Request Body
    const { htmlContent } = await req.json();

    if (!htmlContent || typeof htmlContent !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid htmlContent in request body" },
        { status: 400 }
      );
    }

    // --- 3. Configure and Select AI Model Directly ---
    const provider = process.env.AI_PROVIDER?.toLowerCase() || "openai";
    let model: LanguageModel; // Use the generic LanguageModel type from 'ai'

    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey)
        throw new Error("OPENAI_API_KEY environment variable is not set.");
      const modelName = process.env.OPENAI_MODEL || "gpt-4o";
      model = createOpenAI({ apiKey: apiKey })(modelName);
      console.log(`[AI Convert] Using OpenAI model: ${modelName}`);
    } else if (provider === "google" || provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey)
        throw new Error("GEMINI_API_KEY environment variable is not set.");
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // Default model
      // createGoogleGenerativeAI returns a factory, call it with the model name
      model = createGoogleGenerativeAI({ apiKey: apiKey })(modelName);
      console.log(`[AI Convert] Using Google model: ${modelName}`);
    } else {
      throw new Error(
        `Unsupported AI_PROVIDER: ${provider}. Set AI_PROVIDER to 'openai' or 'google' in .env.`
      );
    }
    // --- End Model Selection ---

    // 4. Execute AI Task
    console.log(
      `[AI Convert] Starting conversion for content snippet: ${htmlContent.substring(0, 100)}...`
    );
    const {
      text: processedContent,
      finishReason,
      usage,
    } = await generateText({
      model: model,
      system: measurementConversionPrompt,
      prompt: htmlContent,
      temperature: 0.2,
    });
    console.log(
      `[AI Convert] Finished. Reason: ${finishReason}, Tokens: ${usage.completionTokens}/${usage.promptTokens}`
    );

    // 5. Validate AI Output
    if (
      !processedContent ||
      finishReason === "error" ||
      finishReason === "unknown"
    ) {
      console.error(
        `[AI Convert] AI processing failed or returned empty content. Finish Reason: ${finishReason}`
      );
      throw new Error("AI processing failed or returned empty content.");
    }

    // 6. Return Result
    return NextResponse.json({ processedContent });
  } catch (error) {
    console.error("[AI Convert Error]", error);
    const message =
      error instanceof Error ? error.message : "AI processing failed.";
    const displayMessage =
      process.env.NODE_ENV === "development"
        ? message
        : "Server error during recipe conversion.";
    return NextResponse.json(
      { message: `Error processing recipe: ${displayMessage}` },
      { status: 500 }
    );
  }
}
