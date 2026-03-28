import type { LanguageModelUsage } from "ai";
import { generateText } from "ai";

import { getAiModel } from "./model";

type ProcessAIOptions = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
};

type ProcessAIResult = {
  processedContent: string;
  usage: LanguageModelUsage;
  finishReason: string;
};

/**
 * Processes input using the configured AI model.
 * @param options - Configuration options for AI processing
 * @returns The processed content, usage statistics, and completion reason
 * @throws Error if AI processing fails
 */
export async function processWithAI({
  systemPrompt,
  userPrompt,
  temperature = 0.2,
}: ProcessAIOptions): Promise<ProcessAIResult> {
  const model = getAiModel();

  const { text, finishReason, usage } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    temperature,
  });

  if (!text || ["error", "unknown"].includes(finishReason)) {
    const reason = !text ? "Empty response" : `Finish reason: ${finishReason}`;
    throw new Error(`AI processing failed (${reason})`);
  }

  return { processedContent: text, usage, finishReason };
}
