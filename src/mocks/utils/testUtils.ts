import { http, HttpResponse } from "msw";

import { resetMockData, getMockState } from "../index";
import { server } from "../server";

/**
 * Clean, focused test utilities for MSW
 */
export class TestUtils {
  /**
   * Reset everything between tests
   */
  static reset() {
    resetMockData();
  }

  /**
   * Set current user for test requests
   */
  static setUser(userId: string = "user_123") {
    return { "x-user-id": userId };
  }

  /**
   * Get current mock data state
   */
  static getState() {
    return getMockState();
  }

  /**
   * Mock successful API responses
   */
  static mockResponse(
    method: "get" | "post" | "put" | "delete",
    path: string,
    response: Record<string, unknown>
  ) {
    server.use(
      http[method](path, () => HttpResponse.json(response))
    );
  }

  /**
   * Mock API error responses
   */
  static mockError(
    method: "get" | "post" | "put" | "delete",
    path: string,
    status = 500,
    message = "Internal Server Error"
  ) {
    server.use(
      http[method](path, () => HttpResponse.json({ message }, { status }))
    );
  }

  /**
   * Mock network delays for loading state testing
   */
  static mockDelay(
    method: "get" | "post" | "put" | "delete",
    path: string,
    delay: number,
    response: Record<string, unknown> = {}
  ) {
    server.use(
      http[method](path, async () => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return HttpResponse.json(response);
      })
    );
  }

  /**
   * Mock authentication failures
   */
  static mockUnauthenticated() {
    server.use(
      http.get("/api/*", () =>
        HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
      )
    );
  }
}

/**
 * Convenient aliases for common operations
 */
export const mockUtils = TestUtils;
export const reset = () => TestUtils.reset();
export const setUser = (userId?: string) => TestUtils.setUser(userId);
export const getState = () => TestUtils.getState();
