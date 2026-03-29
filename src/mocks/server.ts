import { setupServer } from "msw/node";

import { recipeHandlers } from "./handlers";

// Create MSW server with all handlers
export const server = setupServer(...recipeHandlers);

// Export handlers and utilities
export { recipeHandlers } from "./handlers";
export { resetMockData, getMockState } from "./handlers";
export * from "./mockData";
