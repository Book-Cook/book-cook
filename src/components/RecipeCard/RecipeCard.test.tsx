import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";

import { RecipeCard } from "./RecipeCard";

import { RecipeContext } from "../../context/RecipeProvider/RecipeProvider";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    <img alt={alt} {...props} />
  ),
}));

// Mock RecipeProvider context
const mockRecipeContext = {
  recipe: null,
  isLoading: false,
  isAuthorized: true,
  error: null,
  editableData: {
    title: "",
    content: "",
    tags: [],
    imageURL: "",
    emoji: "",
    _id: "test-recipe-id",
    isPublic: false,
  },
  updateEditableDataKey: jest.fn(),
  updateEditableData: jest.fn(),
  handleAddTag: jest.fn(),
  handleRemoveTag: jest.fn(),
  saveChanges: jest.fn(),
  cancelEditing: jest.fn(),
  deleteRecipe: jest.fn(),
  onAddToCollection: jest.fn(),
  onSaveRecipe: jest.fn(),
  hasEdits: false,
};

const RecipeWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RecipeContext.Provider value={mockRecipeContext}>
        {children}
      </RecipeContext.Provider>
    </QueryClientProvider>
  );
};

describe("RecipeCard", () => {
  const defaultProps = {
    title: "Test Recipe",
    createdDate: "2024-01-01T00:00:00.000Z",
    id: "recipe123",
    emoji: "🍕",
    tags: ["test", "recipe"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders recipe card with basic information", () => {
    render(
      <RecipeWrapper>
        <RecipeCard {...defaultProps} />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Test Recipe placeholder emoji/i })).toBeInTheDocument();
  });

  it("shows creator information when provided", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          creatorName="John Doe"
          savedCount={15}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("By John Doe • 15 saves")).toBeInTheDocument();
    expect(screen.queryByText("Jan 1, 2024")).not.toBeInTheDocument();
  });

  it("shows date when no creator information provided", () => {
    render(
      <RecipeWrapper>
        <RecipeCard {...defaultProps} />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
    expect(screen.queryByText(/By.*saves/)).not.toBeInTheDocument();
  });

  it("handles zero saves count", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          creatorName="Jane Doe"
          savedCount={0}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("By Jane Doe • 0 saves")).toBeInTheDocument();
  });

  it("handles undefined saves count", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          creatorName="Jane Doe"
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("By Jane Doe • 0 saves")).toBeInTheDocument();
  });

  it("shows actions menu when showActions is true", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          showActions={true}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByRole("button", { name: /more options/i })).toBeInTheDocument();
  });

  it("hides actions menu when showActions is false", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          showActions={false}
        />
      </RecipeWrapper>
    );
    
    expect(screen.queryByRole("button", { name: /more options/i })).not.toBeInTheDocument();
  });

  it("shows actions menu by default when showActions is not specified", () => {
    render(
      <RecipeWrapper>
        <RecipeCard {...defaultProps} />
      </RecipeWrapper>
    );
    
    expect(screen.getByRole("button", { name: /more options/i })).toBeInTheDocument();
  });

  it("hides actions menu in minimal mode", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          isMinimal={true}
        />
      </RecipeWrapper>
    );
    
    expect(screen.queryByRole("button", { name: /more options/i })).not.toBeInTheDocument();
  });

  it("navigates to recipe page when clicked", () => {
    render(
      <RecipeWrapper>
        <RecipeCard {...defaultProps} />
      </RecipeWrapper>
    );
    
    const card = screen.getByRole("button");
    fireEvent.click(card);
    
    expect(mockPush).toHaveBeenCalledWith("/recipes/recipe123");
  });

  it("displays recipe image when provided", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          imageSrc="https://example.com/image.jpg"
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByRole("img", { name: "Test Recipe" })).toBeInTheDocument();
  });

  it("displays emoji fallback when no image", () => {
    render(
      <RecipeWrapper>
        <RecipeCard {...defaultProps} />
      </RecipeWrapper>
    );
    
    expect(screen.getByRole("img", { name: /Test Recipe placeholder emoji/i })).toBeInTheDocument();
    expect(screen.getByText("🍕")).toBeInTheDocument();
  });

  it("shows NEW badge for recent recipes", () => {
    const recentDate = new Date();
    recentDate.setHours(recentDate.getHours() - 12); // 12 hours ago
    
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          createdDate={recentDate.toISOString()}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("does not show NEW badge for old recipes", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 2); // 2 days ago
    
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          createdDate={oldDate.toISOString()}
        />
      </RecipeWrapper>
    );
    
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();
  });

  it("displays tags correctly", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          tags={["italian", "pasta", "dinner"]}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("italian")).toBeInTheDocument();
    expect(screen.getByText("pasta")).toBeInTheDocument();
    expect(screen.getByText("dinner")).toBeInTheDocument();
  });

  it("shows +more indicator when there are more than 3 tags", () => {
    render(
      <RecipeWrapper>
        <RecipeCard
          {...defaultProps}
          tags={["tag1", "tag2", "tag3", "tag4", "tag5"]}
        />
      </RecipeWrapper>
    );
    
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("tag3")).toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    expect(screen.queryByText("tag4")).not.toBeInTheDocument();
  });
});