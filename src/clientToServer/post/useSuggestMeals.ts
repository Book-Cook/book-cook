import { useMutation } from "@tanstack/react-query";

interface SuggestMealsPayload {
  ingredients: string[];
}

interface SuggestMealsResponse {
  suggestions: string;
}

export const useSuggestMeals = () => {
  return useMutation<SuggestMealsResponse, Error, SuggestMealsPayload>({
    mutationKey: ["suggestMealsAI"],
    mutationFn: async (payload) => {
      const response = await fetch("/api/ai/suggestMeals", {
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
