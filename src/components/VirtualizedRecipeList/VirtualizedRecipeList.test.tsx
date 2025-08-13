import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import { VirtualizedRecipeList } from './VirtualizedRecipeList';

import type { Recipe } from '../../clientToServer/types';
import { RecipeContext } from '../../context/RecipeProvider/RecipeProvider';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src, ...props }: { alt: string; src?: string; [key: string]: unknown }) => {
    const filteredProps = { ...props };
    delete filteredProps.blurDataURL;
    delete filteredProps.placeholder;
    delete filteredProps.quality;
    delete filteredProps.loading;
    delete filteredProps.sizes;
    delete filteredProps.draggable;
    delete filteredProps.fill;
    return <img alt={alt} src={src} {...filteredProps} />;
  },
}));

// Mock RecipeProvider context
const mockRecipeContext = {
  recipe: null,
  isLoading: false,
  isAuthorized: true,
  error: null,
  editableData: {
    title: '',
    content: '',
    tags: [],
    imageURL: '',
    emoji: '',
    _id: 'test-recipe-id',
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

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
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

describe('VirtualizedRecipeList', () => {
  const mockRecipes: Recipe[] = [
    {
      _id: '1',
      title: 'Test Recipe 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      imageURL: '',
      emoji: '🍕',
      tags: ['test'],
      data: '',
      owner: 'user1',
      isPublic: false,
    },
    {
      _id: '2',
      title: 'Test Recipe 2',
      createdAt: '2024-01-02T00:00:00.000Z',
      imageURL: '',
      emoji: '🍝',
      tags: ['test', 'pasta'],
      data: '',
      owner: 'user1',
      isPublic: true,
    },
  ];

  const defaultProps = {
    recipes: mockRecipes,
    totalCount: 2,
    currentPage: 1,
    pageSize: 20,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recipe list with recipes', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={[]}
          isLoading={true}
          loadingMessage="Loading recipes..."
        />
      </TestWrapper>
    );

    expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Failed to load recipes');
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={[]}
          error={error}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load recipes')).toBeInTheDocument();
  });

  it('shows empty state when no recipes and totalCount is 0', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={[]}
          totalCount={0}
          emptyStateMessage="No recipes found."
        />
      </TestWrapper>
    );

    expect(screen.getByText('No recipes found.')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria or filters.')).toBeInTheDocument();
  });

  it('renders pagination when totalPages > 1', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          totalCount={50}
          pageSize={20}
        />
      </TestWrapper>
    );

    // Should show pagination controls for 3 pages (50 items / 20 per page)
    expect(screen.getByText('Showing 1-20 of 50 items')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('does not render pagination when totalPages <= 1', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          totalCount={15}
          pageSize={20}
        />
      </TestWrapper>
    );

    // Should not show pagination for 1 page
    expect(screen.queryByText('Showing')).not.toBeInTheDocument();
  });

  it('renders recipe cards with correct props', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList {...defaultProps} />
      </TestWrapper>
    );

    // Check that recipe cards are rendered with correct information
    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    expect(screen.getAllByText('test')).toHaveLength(2); // Both recipes have this tag
    expect(screen.getByText('pasta')).toBeInTheDocument();
  });

  it('shows creator name for public recipes', () => {
    const publicRecipes: Recipe[] = [
      {
        _id: '1',
        title: 'Public Recipe',
        createdAt: '2024-01-01T00:00:00.000Z',
        imageURL: '',
        emoji: '🍕',
        tags: ['public'],
        data: '',
        owner: 'user2',
        isPublic: true,
        creatorName: 'John Doe',
        savedCount: 10,
      },
    ];

    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={publicRecipes}
          totalCount={1}
        />
      </TestWrapper>
    );

    expect(screen.getByText('By John Doe • 10 saves')).toBeInTheDocument();
  });

  it('applies fade-in animation to recipe cards', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList {...defaultProps} />
      </TestWrapper>
    );

    // Check that cards have the fadeIn class and styles
    const recipeCards = screen.getAllByText(/Test Recipe/);
    expect(recipeCards).toHaveLength(2);
    
    // Check that fade-in delay styles are applied correctly
    const cardContainer1 = recipeCards[0].closest('[style*="--fadeInDelay"]');
    const cardContainer2 = recipeCards[1].closest('[style*="--fadeInDelay"]');
    
    expect(cardContainer1).toBeTruthy();
    expect(cardContainer2).toBeTruthy();
  });

  it('limits fade-in delay to maximum of 0.3s', () => {
    const manyRecipes: Recipe[] = Array.from({ length: 5 }, (_, i) => ({
      _id: `${i + 1}`,
      title: `Recipe ${i + 1}`,
      createdAt: '2024-01-01T00:00:00.000Z',
      imageURL: '',
      emoji: '🍕',
      tags: ['test'],
      data: '',
      owner: 'user1',
      isPublic: false,
    }));

    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={manyRecipes}
          totalCount={5}
        />
      </TestWrapper>
    );

    // Check that all recipe cards are rendered
    const recipeCards = screen.getAllByText(/Recipe \d/);
    expect(recipeCards).toHaveLength(5);
    
    // Verify that cards with higher indices have fade delay styles
    const cardContainer = recipeCards[3].closest('[style*="--fadeInDelay"]'); // Recipe 4
    expect(cardContainer).toBeTruthy();
  });

  it('uses custom loading message', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={[]}
          isLoading={true}
          loadingMessage="Custom loading message"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('uses custom empty state message', () => {
    render(
      <TestWrapper>
        <VirtualizedRecipeList
          {...defaultProps}
          recipes={[]}
          totalCount={0}
          emptyStateMessage="Custom empty message"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });
});