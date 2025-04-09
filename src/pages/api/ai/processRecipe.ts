import { NextRequest, NextResponse } from "next/server";
import { processWithAI } from "../../../server";
import { measurementConversionPrompt } from "../../../constants";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const { htmlContent } = await req.json();

    if (!htmlContent || typeof htmlContent !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid htmlContent in request body" },
        { status: 400 }
      );
    }

    const { processedContent } = await processWithAI({
      systemPrompt: measurementConversionPrompt,
      userPrompt: htmlContent,
    });
    return NextResponse.json({ processedContent });
  } catch (error) {
    console.error("[API Route Error]", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const displayMessage =
      process.env.NODE_ENV === "development"
        ? message
        : "Server error during recipe conversion";

    return NextResponse.json(
      { message: `Error processing recipe: ${displayMessage}` },
      { status: 500 }
    );
  }
}
