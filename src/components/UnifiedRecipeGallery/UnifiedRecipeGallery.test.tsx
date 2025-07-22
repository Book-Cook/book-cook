import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { UnifiedRecipeGallery } from "./UnifiedRecipeGallery";

import { SearchBoxProvider } from "../../context";

const mockRouterPush = jest.fn();
const mockRouterReplace = jest.fn();

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../RecipeGallery/RecipeGallery", () => ({
  RecipeGallery: () => <div data-testid="personal-recipes">Personal Recipes</div>,
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const createTestWrapper = (initialSearchValue = "") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SearchBoxProvider
        value={{
          searchBoxValue: initialSearchValue,
          onSearchBoxValueChange: jest.fn(),
        }}
      >
        {children}
      </SearchBoxProvider>
    </QueryClientProvider>
  );
  TestWrapper.displayName = "TestWrapper";
  return TestWrapper;
};

describe("UnifiedRecipeGallery", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "123" }, expires: "future" },
      status: "authenticated",
    });

    mockUseRouter.mockReturnValue({
      query: {},
      pathname: "/recipes",
      push: mockRouterPush,
      replace: mockRouterReplace,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders tab interface with correct labels", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    expect(screen.getByRole("tab", { name: "View your personal recipes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Browse all public recipes" })).toBeInTheDocument();
    expect(screen.getByText("My Recipes")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
  });

  it("shows My Recipes tab as active by default", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const myRecipesTab = screen.getByRole("tab", { name: "View your personal recipes" });
    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });

    expect(myRecipesTab).toHaveAttribute("aria-selected", "true");
    expect(communityTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("personal-recipes")).toBeInTheDocument();
  });

  it("switches to Community tab when clicked", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });
    fireEvent.click(communityTab);

    expect(communityTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("community-recipes")).toBeInTheDocument();
  });

  it("handles keyboard navigation correctly", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });
    
    // Test Enter key
    fireEvent.keyDown(communityTab, { key: "Enter" });
    expect(communityTab).toHaveAttribute("aria-selected", "true");

    const myRecipesTab = screen.getByRole("tab", { name: "View your personal recipes" });
    
    // Test Space key  
    fireEvent.keyDown(myRecipesTab, { key: " " });
    expect(myRecipesTab).toHaveAttribute("aria-selected", "true");
  });

  it("initializes with URL tab parameter", () => {
    mockUseRouter.mockReturnValue({
      query: { tab: "community" },
      pathname: "/recipes",
      push: mockRouterPush,
      replace: mockRouterReplace,
    });

    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });
    expect(communityTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("community-recipes")).toBeInTheDocument();
  });

  it("updates URL when tab changes", async () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });
    fireEvent.click(communityTab);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith(
        {
          pathname: "/recipes",
          query: { tab: "community" },
        },
        undefined,
        { shallow: true }
      );
    });
  });

  it("removes tab parameter for default tab", async () => {
    mockUseRouter.mockReturnValue({
      query: { tab: "community" },
      pathname: "/recipes",
      push: mockRouterPush,
      replace: mockRouterReplace,
    });

    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const myRecipesTab = screen.getByRole("tab", { name: "View your personal recipes" });
    fireEvent.click(myRecipesTab);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith(
        {
          pathname: "/recipes",
          query: {},
        },
        undefined,
        { shallow: true }
      );
    });
  });

  it("calls onTabChange callback when provided", () => {
    const mockOnTabChange = jest.fn();
    render(<UnifiedRecipeGallery onTabChange={mockOnTabChange} />, { 
      wrapper: createTestWrapper() 
    });

    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });
    fireEvent.click(communityTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("community");
  });

  it("shows unauthorized screen when not logged in", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Recipe gallery tabs");

    const tabpanel = screen.getByRole("tabpanel");
    expect(tabpanel).toHaveAttribute("aria-labelledby", "tab-my-recipes");
  });

  it("manages focus correctly", () => {
    render(<UnifiedRecipeGallery />, { wrapper: createTestWrapper() });

    const myRecipesTab = screen.getByRole("tab", { name: "View your personal recipes" });
    const communityTab = screen.getByRole("tab", { name: "Browse all public recipes" });

    expect(myRecipesTab).toHaveAttribute("tabIndex", "0");
    expect(communityTab).toHaveAttribute("tabIndex", "-1");

    fireEvent.click(communityTab);

    expect(myRecipesTab).toHaveAttribute("tabIndex", "-1");
    expect(communityTab).toHaveAttribute("tabIndex", "0");
  });
});