/**
 * Mock date utilities for consistent dates in tests and Storybook
 *
 * Using fixed dates ensures that Chromatic visual snapshots remain consistent
 * across different test runs and don't detect false changes due to dynamic dates.
 */

// Base date for all mocks: January 15, 2024
export const MOCK_BASE_DATE = '2024-01-15T12:00:00.000Z';

/**
 * Get a date relative to the mock base date
 * @param daysOffset - Number of days to offset from the base date (negative for past, positive for future)
 * @returns ISO date string in YYYY-MM-DD format
 */
export const getMockDate = (daysOffset: number = 0): string => {
  const date = new Date(MOCK_BASE_DATE);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

/**
 * Get a full ISO timestamp relative to the mock base date
 * @param daysOffset - Number of days to offset from the base date
 * @param hours - Optional hours to add
 * @returns ISO timestamp string
 */
export const getMockTimestamp = (daysOffset: number = 0, hours: number = 0): string => {
  const date = new Date(MOCK_BASE_DATE);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

/**
 * Get a mock ID with a consistent counter instead of Date.now()
 */
let mockIdCounter = 1000;
export const getMockId = (prefix: string = 'mock'): string => {
  return `${prefix}_${mockIdCounter++}`;
};

/**
 * Reset the mock ID counter (useful for tests)
 */
export const resetMockIdCounter = (): void => {
  mockIdCounter = 1000;
};

/**
 * Common mock dates for convenience
 */
export const MOCK_DATES = {
  yesterday: getMockDate(-1),
  today: getMockDate(0),
  tomorrow: getMockDate(1),
  dayAfterTomorrow: getMockDate(2),
  nextWeek: getMockDate(7),
  lastWeek: getMockDate(-7),
} as const;

/**
 * Common mock timestamps for convenience
 */
export const MOCK_TIMESTAMPS = {
  yesterday: getMockTimestamp(-1),
  today: getMockTimestamp(0),
  tomorrow: getMockTimestamp(1),
  dayAfterTomorrow: getMockTimestamp(2),
  nextWeek: getMockTimestamp(7),
  lastWeek: getMockTimestamp(-7),
} as const;
