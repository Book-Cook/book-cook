import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/**
 * Gets the configured AI Language Model instance based on environment variables.
 * @returns Configured LanguageModel instance.
 * @throws Error if required configuration is missing or invalid.
 */
export function getAiModel(): LanguageModel {
  const provider = process.env.AI_PROVIDER?.toLowerCase() ?? "openai";

  const getGoogleModel = () => {
    const apiKey = process?.env?.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    const modelName = process?.env?.GEMINI_MODEL ?? "gemini-1.5-flash";
    return createGoogleGenerativeAI({ apiKey })(modelName);
  };

  const providers: Record<string, () => LanguageModel> = {
    openai: () => {
      const apiKey = process?.env?.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY environment variable is not set.");
      }
      const modelName = process?.env?.OPENAI_MODEL ?? "gpt-4o";
      return createOpenAI({ apiKey })(modelName);
    },
    google: getGoogleModel,
    gemini: getGoogleModel,
  };

  try {
    const getModel = providers[provider];
    if (!getModel) {
      throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
    }
    return getModel();
  } catch (error) {
    console.error("[AI Model] Configuration failed:", error);
    throw error;
  }
}
