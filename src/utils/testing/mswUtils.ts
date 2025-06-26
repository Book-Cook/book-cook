import { http, HttpResponse } from "msw";

import { resetMockData, getMockState } from "../../mocks/handlers";
import { mockUsers } from "../../mocks/mockData";
import { server } from "../../mocks/server";

/**
 * Test utilities for MSW setup with recipe API
 */

/**
 * Reset all mock data to initial state between tests
 */
export const resetAllMocks = () => {
  resetMockData();
  server.resetHandlers();
};

/**
 * Set the current user for API requests in tests
 * @param userId - User ID to set as current user
 */
export const setTestUser = (userId: string = mockUsers.testUser.id) => {
  // This would be used in your test setup to set headers
  return {
    "x-user-id": userId,
  };
};

/**
 * Get current mock state for assertions
 */
export const getMockDataState = getMockState;

/**
 * Mock a specific API endpoint with custom response
 * @param method - HTTP method
 * @param path - API path
 * @param response - Custom response
 * @param status - HTTP status code
 */
export const mockApiResponse = (
  method: "get" | "post" | "put" | "delete",
  path: string,
  response: any,
  status: number = 200
) => {
  server.use(
    http[method](path, () => {
      return HttpResponse.json(response, { status });
    })
  );
};

/**
 * Mock API error response
 * @param method - HTTP method
 * @param path - API path
 * @param message - Error message
 * @param status - Error status code
 */
export const mockApiError = (
  method: "get" | "post" | "put" | "delete",
  path: string,
  message: string = "Internal Server Error",
  status: number = 500
) => {
  server.use(
    http[method](path, () => {
      return HttpResponse.json({ message }, { status });
    })
  );
};

/**
 * Simulate network delay for testing loading states
 * @param method - HTTP method
 * @param path - API path
 * @param delay - Delay in milliseconds
 * @param response - Response data
 */
export const mockApiWithDelay = (
  method: "get" | "post" | "put" | "delete",
  path: string,
  delay: number,
  response: any = { success: true }
) => {
  server.use(
    http[method](path, async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return HttpResponse.json(response);
    })
  );
};

/**
 * Mock authentication failure
 */
export const mockAuthError = () => {
  server.use(
    http.get("/api/recipes*", () => {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    })
  );
};

/**
 * Verify that an API call was made with specific parameters
 * This is a utility to help with API call verification in tests
 */
export const createApiCallVerifier = () => {
  const calls: Array<{ method: string; url: string; body?: unknown }> = [];

  // Override console.log temporarily to capture calls
  const originalFetch = global.fetch;

  const startTracking = () => {
    calls.length = 0;
    global.fetch = jest.fn().mockImplementation(async (url, options) => {
      calls.push({
        method: options?.method ?? "GET",
        url: url.toString(),
        body: options?.body ? JSON.parse(options.body as string) : undefined,
      });
      return originalFetch(url, options);
    });
  };

  const stopTracking = () => {
    global.fetch = originalFetch;
  };

  const getCalls = () => [...calls];

  const getCallsForEndpoint = (endpoint: string) =>
    calls.filter((call) => call.url.includes(endpoint));

  return {
    startTracking,
    stopTracking,
    getCalls,
    getCallsForEndpoint,
  };
};

/**
 * Export mock users for easy access in tests
 */
export { mockUsers } from "../../mocks/mockData";
