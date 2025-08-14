import React, { useEffect } from 'react';

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from '../mocks/data/recipes';

export interface ApiMockConfig {
  [endpoint: string]: {
    method?: string;
    response: unknown;
    status?: number;
    delay?: number;
    handler?: (req: any) => unknown;
  } | {
    [method: string]: {
      response: unknown;
      status?: number;
      delay?: number;
      handler?: (req: any) => unknown;
    };
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
      if (urlString.includes(endpoint)) {
        let mockConfig: any = null;
        
        // Check if this is a method-specific configuration
        if ('method' in config || 'response' in config) {
          // Legacy format: single config with optional method
          const legacyConfig = config as { method?: string; response: unknown; status?: number; delay?: number; handler?: (req: any) => unknown; };
          const mockMethod = legacyConfig.method?.toUpperCase() ?? 'GET';
          if (method === mockMethod) {
            mockConfig = legacyConfig;
          }
        } else {
          // New format: method-specific configs
          const methodConfigs = config as { [method: string]: { response: unknown; status?: number; delay?: number; handler?: (req: any) => unknown; } };
          mockConfig = methodConfigs[method];
        }
        
        if (mockConfig) {
          if (mockConfig.delay) {
            await new Promise(resolve => setTimeout(resolve, mockConfig.delay));
          }
          
          // Use handler if available, otherwise use response
          const responseData = mockConfig.handler 
            ? mockConfig.handler({ body: options?.body, headers: options?.headers, method })
            : mockConfig.response;
          
          return new Response(JSON.stringify(responseData), {
            status: mockConfig.status ?? 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
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
    const cleanup = createFetchMock(mockConfig);
    
    const MockWrapper = () => {
      useEffect(() => {
        return cleanup;
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