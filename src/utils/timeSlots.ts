/**
 * Utility functions for working with time-based meal planning
 */

export interface TimeSlotConfig {
  startHour: number; // 0-23
  endHour: number; // 0-23
  intervalMinutes: number; // 15, 30, 60, etc.
}

export const DEFAULT_TIME_CONFIG: TimeSlotConfig = {
  startHour: 6, // 6 AM
  endHour: 23, // 11 PM
  intervalMinutes: 60, // 1 hour intervals
};

/**
 * Generate time slots for a day based on configuration
 */
export function generateTimeSlots(
  config: TimeSlotConfig = DEFAULT_TIME_CONFIG,
): string[] {
  const slots: string[] = [];
  const { startHour, endHour, intervalMinutes } = config;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);

      // Don't add partial slots past end hour
      if (hour === endHour && minute > 0) {
        break;
      }
    }
  }

  return slots;
}

/**
 * Format time string for display (e.g., "08:00" -> "8:00 AM")
 */
export function formatTimeForDisplay(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute =
    minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;

  return `${displayHour}${displayMinute} ${period}`;
}

/**
 * Parse time string to get hour and minute
 */
export function parseTime(time: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = time.split(":");
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
  };
}

/**
 * Convert legacy meal type to suggested time
 */
export function mealTypeToTime(mealType: string): string {
  switch (mealType.toLowerCase()) {
    case "breakfast":
      return "08:00";
    case "lunch":
      return "12:30";
    case "dinner":
      return "18:30";
    case "snack":
      return "15:00";
    default:
      return "12:00";
  }
}
