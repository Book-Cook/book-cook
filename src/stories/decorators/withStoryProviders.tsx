import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface StoryProvidersOptions {
  queryClient?: QueryClient;
}

export const withStoryProviders = (options: StoryProvidersOptions = {}) => {
  const StoryWrapper = (Story: React.ComponentType) => {
    const queryClient = options.queryClient ?? new QueryClient({
      defaultOptions: {
        queries: { 
          retry: false, 
          staleTime: 0,
          refetchOnWindowFocus: false,
        },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
  
  StoryWrapper.displayName = 'StoryProviders';
  return StoryWrapper;
};