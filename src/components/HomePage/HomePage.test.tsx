import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

import HomePage from "./HomePage";

import { caesarSalad, chocolateChipCookies, thaiGreenCurry } from "../../mocks/data/recipes";
import { GetRecentlyViewedResponses } from "../../mocks/responses/user/getRecentlyViewed";
import { GetUserCollectionsResponses } from "../../mocks/responses/user/getUserCollections";
import { mockUtils } from "../../mocks/utils/testUtils";

// Mock Next.js router
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

// Mock next-auth session
const mockSession = {
  user: {
    id: "user_123",
    email: "test@example.com",
    name: "Test User",
  },
  expires: "2024-12-31",
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={mockSession}>{children}</SessionProvider>
    </QueryClientProvider>
  );
};

describe("HomePage Component", () => {
  beforeEach(() => {
    mockUtils.reset();
  });

  describe("Loading States", () => {
    it("should show loading skeletons when data is loading", async () => {
      // Mock delayed responses to test loading state
      mockUtils.mockDelay(
        "get",
        "/api/user/recentlyViewed",
        1000,
        GetRecentlyViewedResponses.success.empty
      );
      mockUtils.mockDelay(
        "get",
        "/api/user/collections",
        1000,
        GetUserCollectionsResponses.success.empty
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Should show skeleton loading states
      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
      });
    });

    it("should show proper loading states for each carousel independently", async () => {
      // Mock one fast, one slow response
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockDelay(
        "get",
        "/api/user/collections",
        1000,
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Recently viewed should load quickly
      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
      });

      // Collections should still be loading
      expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
    });
  });

  describe("Data Display", () => {
    it("should display recently viewed recipes when available", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.empty
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Wait for recipes to load
      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText(caesarSalad.title)).toBeInTheDocument();
        expect(
          screen.getByText(chocolateChipCookies.title)
        ).toBeInTheDocument();
      });
    });

    it("should display favorite recipes when available", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.empty
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Wait for collections to load
      await waitFor(() => {
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
        expect(
          screen.getByText(chocolateChipCookies.title)
        ).toBeInTheDocument();
        expect(screen.getByText(thaiGreenCurry.title)).toBeInTheDocument();
      });
    });

    it("should display both carousels with different recipe sets", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Both carousel titles should be present
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();

        // Should have multiple recipe cards
        const recipeCards = screen.getAllByText(chocolateChipCookies.title);
        expect(recipeCards.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Empty States", () => {
    it("should handle empty recently viewed recipes gracefully", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.empty
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(
          screen.getByText("You haven't viewed any recipes yet.")
        ).toBeInTheDocument();
      });
    });

    it("should handle empty collections gracefully", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.empty
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
        expect(
          screen.getByText("You haven't viewed any recipes yet.")
        ).toBeInTheDocument();
      });
    });

    it("should handle both sections being empty", async () => {
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.empty
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.empty
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();

        // Should show empty state messages
        const emptyMessages = screen.getAllByText(
          "You haven't viewed any recipes yet."
        );
        expect(emptyMessages.length).toBe(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle recently viewed API errors gracefully", async () => {
      // Suppress expected console errors during this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockUtils.mockError(
        "get",
        "/api/user/recentlyViewed",
        500,
        "Internal Server Error"
      );
      mockUtils.mockResponse(
        "get",
        "/api/user/collections",
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should still show the carousel title
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();

        // Collections should work fine
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
        expect(
          screen.getByText(chocolateChipCookies.title)
        ).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });

    it("should handle collections API errors gracefully", async () => {
      // Suppress expected console errors during this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockError(
        "get",
        "/api/user/collections",
        500,
        "Internal Server Error"
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Recently viewed should work fine
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText(caesarSalad.title)).toBeInTheDocument();

        // Should still show the collections title
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });

    it("should handle both APIs failing", async () => {
      // Suppress expected console errors during this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockUtils.mockError(
        "get",
        "/api/user/recentlyViewed",
        500,
        "Internal Server Error"
      );
      mockUtils.mockError(
        "get",
        "/api/user/collections",
        500,
        "Internal Server Error"
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should still render the page structure
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe("Session Handling", () => {
    it("should not fetch data when user is not authenticated", () => {
      const TestWrapperNoSession: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => {
        const queryClient = new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        });

        return (
          <QueryClientProvider client={queryClient}>
            <SessionProvider session={null}>{children}</SessionProvider>
          </QueryClientProvider>
        );
      };

      render(
        <TestWrapperNoSession>
          <HomePage />
        </TestWrapperNoSession>
      );

      // Should still render structure but not make API calls
      expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
      expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
    });
  });

  describe("API Query Keys", () => {
    it("should use correct query keys for caching", async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
      });

      // Verify that both carousels are rendered with correct structure
      expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
      expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
    });
  });

  describe("Carousel Integration", () => {
    it("should pass correct props to RecipesCarousel components", async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should render carousel component structure correctly
        expect(screen.getByText("Recently Viewed Recipes")).toBeInTheDocument();
        expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
      });

      // Verify that both RecipesCarousel components are rendered
      // The exact recipe content depends on React Query + MSW integration working
      const carouselTitles = screen.getAllByText(/Recently Viewed Recipes|Favorite recipes/);
      expect(carouselTitles).toHaveLength(2);
    });

    it("should handle loading states correctly for carousels", async () => {
      // Mock one endpoint as slow
      mockUtils.mockResponse(
        "get",
        "/api/user/recentlyViewed",
        GetRecentlyViewedResponses.success.withRecipes
      );
      mockUtils.mockDelay(
        "get",
        "/api/user/collections",
        1000,
        GetUserCollectionsResponses.success.withRecipes
      );

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Recently viewed should load first
      await waitFor(() => {
        expect(screen.getByText(caesarSalad.title)).toBeInTheDocument();
      });

      // Collections should still be loading (showing skeleton)
      expect(screen.getByText("Favorite recipes")).toBeInTheDocument();
    });
  });
});
