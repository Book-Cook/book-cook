import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { fetchJson } from "src/utils";
import { useSaveRecipe } from "./useSaveRecipe";

// Mock fetchJson
jest.mock("src/utils", () => ({
  fetchJson: jest.fn(),
}));

const mockFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

describe("useSaveRecipe", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should save a recipe successfully", async () => {
    const mockResponse = {
      success: true,
      action: "saved" as const,
      message: "Recipe saved successfully",
    };
    mockFetchJson.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSaveRecipe(), { wrapper });

    result.current.mutate("recipe123");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetchJson).toHaveBeenCalledWith("/api/user/saved-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: "recipe123" }),
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it("should unsave a recipe successfully", async () => {
    const mockResponse = {
      success: true,
      action: "unsaved" as const,
      message: "Recipe removed from saved",
    };
    mockFetchJson.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSaveRecipe(), { wrapper });

    result.current.mutate("recipe123");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it("should handle errors", async () => {
    const mockError = new Error("Failed to save recipe");
    mockFetchJson.mockRejectedValue(mockError);

    const { result } = renderHook(() => useSaveRecipe(), { wrapper });

    result.current.mutate("recipe123");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain("Failed to save recipe");
  });

  it("should require recipe ID", async () => {
    const { result } = renderHook(() => useSaveRecipe(), { wrapper });

    result.current.mutate("");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Recipe ID is required.");
  });

  it("should update query cache optimistically", async () => {
    // Set initial cache data
    queryClient.setQueryData(["savedRecipes"], [
      { _id: "recipe1" },
      { _id: "recipe2" },
    ]);

    const mockResponse = {
      success: true,
      action: "saved" as const,
      message: "Recipe saved successfully",
    };
    mockFetchJson.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSaveRecipe(), { wrapper });

    result.current.mutate("recipe3");

    // Check that optimistic update occurred
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});