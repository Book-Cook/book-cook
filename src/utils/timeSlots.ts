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
export function generateTimeSlots(config: TimeSlotConfig = DEFAULT_TIME_CONFIG): string[] {
  const slots: string[] = [];
  const { startHour, endHour, intervalMinutes } = config;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute === 0 ? '' : `:${minute.toString().padStart(2, '0')}`;
  
  return `${displayHour}${displayMinute} ${period}`;
}

/**
 * Parse time string to get hour and minute
 */
export function parseTime(time: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = time.split(':');
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
  };
}

/**
 * Check if a time falls within a given range
 */
export function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  const timeMinutes = parseTime(time).hour * 60 + parseTime(time).minute;
  const startMinutes = parseTime(startTime).hour * 60 + parseTime(startTime).minute;
  const endMinutes = parseTime(endTime).hour * 60 + parseTime(endTime).minute;
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(time: string, minutes: number): string {
  const { hour, minute } = parseTime(time);
  const totalMinutes = hour * 60 + minute + minutes;
  
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  
  return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
}

/**
 * Convert legacy meal type to suggested time
 */
export function mealTypeToTime(mealType: string): string {
  switch (mealType.toLowerCase()) {
    case 'breakfast':
      return '08:00';
    case 'lunch':
      return '12:30';
    case 'dinner':
      return '18:30';
    case 'snack':
      return '15:00';
    default:
      return '12:00';
  }
}

/**
 * Get suggested meal type based on time (for backward compatibility)
 */
export function timeToMealType(time: string): string {
  const { hour } = parseTime(time);
  
  if (hour >= 6 && hour < 11) {
    return 'breakfast';
  }
  if (hour >= 11 && hour < 15) {
    return 'lunch';
  }
  if (hour >= 17 && hour < 22) {
    return 'dinner';
  }
  return 'snack';
}