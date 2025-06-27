import React, { useEffect } from 'react';
import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from '../mocks/data/recipes';

// Type for API mock configurations
export interface ApiMockConfig {
  [endpoint: string]: {
    method?: string;
    response: any;
    status?: number;
    delay?: number;
  };
}

// Default mock configurations for common endpoints
export const defaultMocks: ApiMockConfig = {
  '/api/recipes': {
    response: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
  },
  '/api/user/collections': {
    response: [chocolateChipCookies, thaiGreenCurry],
  },
  '/api/user/recentlyViewed': {
    response: [caesarSalad, chocolateChipCookies],
  },
};

// Create a fetch mock setup function
const createFetchMock = (mockConfig: ApiMockConfig) => {
  const originalFetch = window.fetch;
  
  window.fetch = async (url: string | Request | URL, options?: RequestInit) => {
    const urlString = url.toString();
    const method = options?.method?.toUpperCase() || 'GET';
    
    console.log(`🔄 Fetch intercepted: ${method} ${urlString}`);
    
    // Find matching mock config
    for (const [endpoint, config] of Object.entries(mockConfig)) {
      const mockMethod = config.method?.toUpperCase() || 'GET';
      
      if (urlString.includes(endpoint) && method === mockMethod) {
        console.log(`🔄 Returning mock data for ${endpoint}`);
        
        // Add optional delay
        if (config.delay) {
          await new Promise(resolve => setTimeout(resolve, config.delay));
        }
        
        return new Response(JSON.stringify(config.response), {
          status: config.status || 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // For unmatched requests, use original fetch
    return originalFetch(url, options);
  };
  
  console.log('🔄 Fetch mock set up with endpoints:', Object.keys(mockConfig));
  
  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
    console.log('🔄 Fetch mock cleaned up');
  };
};

// Higher-order component for easy mock setup
export const withApiMocks = (mockConfig: ApiMockConfig = defaultMocks) => {
  return (Story: any) => {
    // Set up fetch mock immediately before component renders
    const cleanup = createFetchMock(mockConfig);
    
    const MockWrapper = () => {
      useEffect(() => {
        // Return cleanup function
        return cleanup;
      }, []);
      
      return <Story />;
    };
    
    return <MockWrapper />;
  };
};

// Convenience decorators for common scenarios
export const withRecipeMocks = withApiMocks({
  '/api/recipes': {
    response: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
  },
});

export const withHomepageMocks = withApiMocks({
  '/api/user/collections': {
    response: [chocolateChipCookies, thaiGreenCurry],
  },
  '/api/user/recentlyViewed': {
    response: [caesarSalad, chocolateChipCookies],
  },
});

export const withEmptyMocks = withApiMocks({
  '/api/recipes': {
    response: [],
  },
  '/api/user/collections': {
    response: [],
  },
  '/api/user/recentlyViewed': {
    response: [],
  },
});

export const withErrorMocks = withApiMocks({
  '/api/recipes': {
    response: { error: 'Server error' },
    status: 500,
  },
  '/api/user/collections': {
    response: { error: 'Server error' },
    status: 500,
  },
  '/api/user/recentlyViewed': {
    response: { error: 'Server error' },
    status: 500,
  },
});

export const withLoadingMocks = withApiMocks({
  '/api/recipes': {
    response: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
    delay: 2000, // 2 second delay
  },
  '/api/user/collections': {
    response: [chocolateChipCookies, thaiGreenCurry],
    delay: 2000, // 2 second delay
  },
  '/api/user/recentlyViewed': {
    response: [caesarSalad, chocolateChipCookies],
    delay: 2000, // 2 second delay
  },
});