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
  
  // Pre-populate cache immediately upon creation
  client.setQueryData(['user', 'collections'], staticData.collections);
  client.setQueryData(['user', 'recentlyViewed'], staticData.recentlyViewed);
  client.setQueryData(['recipes'], staticData.recipes);
  client.setQueryData(['recipes', { search: '', sortProperty: 'createdAt', sortDirection: 'desc', tags: [] }], staticData.recipes);
  client.setQueryData(['user'], { id: 'user_123', email: 'test@example.com', name: 'Test User' });
  
  return client;
};

// Static query client instance with pre-populated data
const staticQueryClient = createStaticQueryClient();

// Simplified setup that's already done
const setupStaticData = () => {
  // Data is already set up in createStaticQueryClient
};

export const WithStaticData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    try {
      setupStaticData();
      console.log('Static data setup completed for Chromatic');
    } catch (error) {
      console.warn('Static data setup failed:', error);
    }
  }, []);

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

export { staticData, staticQueryClient };