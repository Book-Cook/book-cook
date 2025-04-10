import { useMutation } from "@tanstack/react-query";

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
      const response = await fetch("/api/ai/processRecipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorMsg = "API request failed";
        try {
          errorMsg = (await response.json()).message ?? errorMsg;
        } catch (e) {
          console.error("Failed to parse error response", e);
        }
        throw new Error(errorMsg);
      }
      return response.json();
    },
  });
};
