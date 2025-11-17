/**
 * MSW Server - Public API for mock service worker
 *
 * This is the standard import point for accessing the MSW server instance
 * and related utilities throughout the application.
 *
 * Usage:
 *   import { server, resetMockData } from '@/mocks/server';
 */

export { server, resetMockData, getMockState, resetHandlers } from "./index";
export * from "./data";
