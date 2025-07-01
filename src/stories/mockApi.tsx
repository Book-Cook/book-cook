import React, { useEffect } from 'react';

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from '../mocks/data/recipes';

export interface ApiMockConfig {
  [endpoint: string]: {
    method?: string;
    response: unknown;
    status?: number;
    delay?: number;
  };
}

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

const createFetchMock = (mockConfig: ApiMockConfig) => {
  const originalFetch = window.fetch;
  
  window.fetch = async (url: string | Request | URL, options?: RequestInit) => {
    const urlString = typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;
    const method = options?.method?.toUpperCase() ?? 'GET';
    
    for (const [endpoint, config] of Object.entries(mockConfig)) {
      const mockMethod = config.method?.toUpperCase() ?? 'GET';
      
      if (urlString.includes(endpoint) && method === mockMethod) {
        if (config.delay && config.delay > 100000) {
          // For infinite delays, never resolve
          await new Promise(() => {}); 
        } else if (config.delay) {
          await new Promise(resolve => setTimeout(resolve, config.delay));
        }
        
        return new Response(JSON.stringify(config.response), {
          status: config.status ?? 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return originalFetch(url, options);
  };
  
  return () => {
    window.fetch = originalFetch;
  };
};

export const withApiMocks = (mockConfig: ApiMockConfig = defaultMocks) => {
  const ApiMockWrapper = (Story: React.ComponentType) => {
    const MockWrapper = () => {
      useEffect(() => {
        const cleanup = createFetchMock(mockConfig);
        
        return () => {
          cleanup();
        };
      }, []);
      
      return <Story />;
    };
    
    return <MockWrapper />;
  };
  
  ApiMockWrapper.displayName = 'ApiMockWrapper';
  return ApiMockWrapper;
};

export const withRecipeMocks = withApiMocks();

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
    delay: 999999, // Never resolve to show loading state
  },
  '/api/user/collections': {
    response: [chocolateChipCookies, thaiGreenCurry],
    delay: 999999, // Never resolve to show loading state
  },
  '/api/user/recentlyViewed': {
    response: [caesarSalad, chocolateChipCookies],
    delay: 999999, // Never resolve to show loading state
  },
});