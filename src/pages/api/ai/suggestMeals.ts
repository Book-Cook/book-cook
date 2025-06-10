import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { mealPlanPrompt } from "../../../constants";
import { processWithAI } from "../../../server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { ingredients } = await req.json();
    if (!Array.isArray(ingredients) || !ingredients.every((i: unknown) => typeof i === "string")) {
      return NextResponse.json(
        { message: "Missing or invalid ingredients in request body" },
        { status: 400 }
      );
    }

    const userPrompt = ingredients.map((i) => `- ${i}`).join("\n");

    const { processedContent } = await processWithAI({
      systemPrompt: mealPlanPrompt,
      userPrompt,
    });

    return NextResponse.json({ suggestions: processedContent });
  } catch (error) {
    console.error("[AI Suggest Meals Error]", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const displayMessage =
      process.env.NODE_ENV === "development"
        ? message
        : "Server error during meal suggestion";
    return NextResponse.json(
      { message: `Error generating suggestions: ${displayMessage}` },
      { status: 500 }
    );
  }
}
