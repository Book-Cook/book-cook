/**
 * Format a date to YYYY-MM-DD string
 */
export const formatDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};