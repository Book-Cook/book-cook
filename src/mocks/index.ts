import { setupServer } from "msw/node";

import { createAIHandlers } from "./handlers/aiHandlers";
import { createRecipeHandlers } from "./handlers/recipeHandlers";
import { createUserHandlers } from "./handlers/userHandlers";
import { DataStore } from "./store/DataStore";

/**
 * Clean MSW setup with proper separation of concerns
 */
class MSWManager {
  private store: DataStore;
  private server: ReturnType<typeof setupServer>;

  constructor() {
    this.store = new DataStore();

    // Combine all handlers with shared store
    const handlers = [
      ...createRecipeHandlers(this.store),
      ...createUserHandlers(this.store),
      ...createAIHandlers(),
    ];

    this.server = setupServer(...handlers);
  }

  /**
   * Start the MSW server
   */
  start(options?: { onUnhandledRequest?: "error" | "warn" | "bypass" }) {
    this.server.listen({
      onUnhandledRequest: "error",
      ...options,
    });
  }

  /**
   * Stop the MSW server
   */
  stop() {
    this.server.close();
  }

  /**
   * Reset handlers between tests
   */
  resetHandlers() {
    this.server.resetHandlers();
  }

  /**
   * Reset all mock data to initial state
   */
  resetData() {
    this.store.reset();
  }

  /**
   * Get current data state for testing
   */
  getDataState() {
    return this.store.getState();
  }

  /**
   * Get access to the data store for advanced testing
   */
  getStore() {
    return this.store;
  }

  /**
   * Add custom handlers for specific tests
   */
  use(...handlers: Parameters<typeof this.server.use>) {
    this.server.use(...handlers);
  }
}

// Create singleton instance
export const mswManager = new MSWManager();

// Export for convenience
export const startMSW = mswManager.start.bind(mswManager);
export const stopMSW = mswManager.stop.bind(mswManager);
export const resetHandlers = mswManager.resetHandlers.bind(mswManager);
export const resetMockData = mswManager.resetData.bind(mswManager);
export const getMockState = mswManager.getDataState.bind(mswManager);
export const getMockStore = mswManager.getStore.bind(mswManager);
export const useMockHandler = mswManager.use.bind(mswManager);
