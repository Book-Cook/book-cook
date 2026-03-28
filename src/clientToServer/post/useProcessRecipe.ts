import { useMutation } from "@tanstack/react-query";

import { fetchJson } from "src/utils";

interface ConvertMeasurementsPayload {
  htmlContent: string;
}

interface ConvertMeasurementsResponse {
  processedContent: string;
}

export const useConvertMeasurements = () => {
  return useMutation<
    ConvertMeasurementsResponse,
    Error,
    ConvertMeasurementsPayload
  >({
    mutationKey: ["convertMeasurementsAI"],
    mutationFn: async (payload) => {
      try {
        return await fetchJson<ConvertMeasurementsResponse>(
          "/api/ai/processRecipe",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
  });
};
