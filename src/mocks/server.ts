/**
 * Legacy server.ts - Re-exports from new modular structure
 * This file maintains backward compatibility for existing imports
 */

// Export server and utilities from new structure
export { server, resetMockData, getMockState, resetHandlers } from "./index";

// Export mock data from new structure
export * from "./data";
