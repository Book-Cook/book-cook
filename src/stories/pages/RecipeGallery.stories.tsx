import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { 
  withRecipeMocks, 
  withEmptyMocks, 
  withErrorMocks, 
  withLoadingMocks,
  withApiMocks 
} from "../mockApi";
import { RecipeGallery } from "../../components/RecipeGallery/RecipeGallery";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese, avocadoToast, lemonGarlicSalmon } from "../../mocks/data/recipes";

const meta: Meta<typeof RecipeGallery> = {
  title: "Pages/RecipeGallery",
  component: RecipeGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeGallery>;

export const Default: Story = {
  name: "Default (All Recipes)",
  render: () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <RecipeGallery />
      </QueryClientProvider>
    );
  },
  decorators: [withRecipeMocks],
};

export const ManyRecipes: Story = {
  name: "Many Recipes",
  render: () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <RecipeGallery />
      </QueryClientProvider>
    );
  },
  decorators: [withApiMocks({
    '/api/recipes': {
      response: [
        chocolateChipCookies,
        thaiGreenCurry,
        caesarSalad,
        beefBolognese,
        avocadoToast,
        lemonGarlicSalmon,
        { ...chocolateChipCookies, _id: "recipe_007", title: "Double Chocolate Cookies" },
        { ...thaiGreenCurry, _id: "recipe_008", title: "Red Thai Curry" },
        { ...caesarSalad, _id: "recipe_009", title: "Greek Salad" },
      ],
    },
  })],
};

export const EmptyState: Story = {
  name: "Empty State",
  render: () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <RecipeGallery />
      </QueryClientProvider>
    );
  },
  decorators: [withEmptyMocks],
};

export const ErrorState: Story = {
  name: "Error State",
  render: () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <RecipeGallery />
      </QueryClientProvider>
    );
  },
  decorators: [withErrorMocks],
};

export const LoadingState: Story = {
  name: "Loading State",
  render: () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <RecipeGallery />
      </QueryClientProvider>
    );
  },
  decorators: [withLoadingMocks],
};
