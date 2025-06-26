import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from '../mocks/data/recipes';

// Static data for Chromatic - no API calls, instant rendering
const staticData = {
  collections: [chocolateChipCookies, thaiGreenCurry],
  recentlyViewed: [caesarSalad, chocolateChipCookies],
  recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
};

// Create a query client that returns static data instantly
const createStaticQueryClient = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable all async behavior for maximum speed
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        gcTime: Infinity,
        // Return data immediately from cache
        networkMode: 'offlineFirst',
      },
    },
  });
  
  // Pre-populate cache with correct query keys that match the components
  const userId = 'user_123';
  
  // HomePage queries
  client.setQueryData(['recentlyViewed', userId], staticData.recentlyViewed);
  client.setQueryData(['recipeCollections', userId], staticData.collections);
  
  // RecipeGallery queries  
  client.setQueryData(['recipes'], staticData.recipes);
  client.setQueryData(['recipes', { search: '', sortProperty: 'createdAt', sortDirection: 'desc', tags: [] }], staticData.recipes);
  
  // User session data
  client.setQueryData(['user'], { id: userId, email: 'test@example.com', name: 'Test User' });
  
  return client;
};

// Static query client instance with pre-populated data
const staticQueryClient = createStaticQueryClient();

// Simplified setup that's already done
const setupStaticData = () => {
  // Data is already set up in createStaticQueryClient
};

// Context for static data without React Query
const StaticDataContext = React.createContext(staticData);

export const WithStaticData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isChromatic = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('HeadlessChrome') || 
     window.navigator.userAgent.includes('Chrome-Lighthouse') ||
     window.location.hostname.includes('chromatic'));

  if (isChromatic) {
    // Use static query client with pre-populated data for Chromatic
    return (
      <StaticDataContext.Provider value={staticData}>
        <QueryClientProvider client={staticQueryClient}>
          {children}
        </QueryClientProvider>
      </StaticDataContext.Provider>
    );
  }

  // Use the pre-populated static query client for Storybook
  return (
    <QueryClientProvider client={staticQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Helper function for stories
export const withStaticData = (StoryComponent: React.FC) => (
  <WithStaticData>
    <StoryComponent />
  </WithStaticData>
);

// Hook to use static data directly in Chromatic
export const useStaticData = () => {
  const context = React.useContext(StaticDataContext);
  return context;
};

export { staticData, staticQueryClient, StaticDataContext };