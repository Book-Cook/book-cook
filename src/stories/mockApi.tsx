import React, { useEffect } from 'react';
import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from '../mocks/data/recipes';

export interface ApiMockConfig {
  [endpoint: string]: {
    method?: string;
    response: any;
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
    const urlString = url.toString();
    const method = options?.method?.toUpperCase() || 'GET';
    
    for (const [endpoint, config] of Object.entries(mockConfig)) {
      const mockMethod = config.method?.toUpperCase() || 'GET';
      
      if (urlString.includes(endpoint) && method === mockMethod) {
        if (config.delay) {
          await new Promise(resolve => setTimeout(resolve, config.delay));
        }
        
        return new Response(JSON.stringify(config.response), {
          status: config.status || 200,
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
  return (Story: any) => {
    const cleanup = createFetchMock(mockConfig);
    
    const MockWrapper = () => {
      useEffect(() => {
        return cleanup;
      }, []);
      
      return <Story />;
    };
    
    return <MockWrapper />;
  };
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
    delay: 2000,
  },
  '/api/user/collections': {
    response: [chocolateChipCookies, thaiGreenCurry],
    delay: 2000,
  },
  '/api/user/recentlyViewed': {
    response: [caesarSalad, chocolateChipCookies],
    delay: 2000,
  },
});