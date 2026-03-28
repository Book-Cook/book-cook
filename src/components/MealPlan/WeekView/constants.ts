export const HOUR_HEIGHT = 60;
export const TIME_COLUMN_WIDTH = 80;
export const MIN_HOUR = 6; // 6 AM
export const MAX_HOUR = 22; // 10 PM
export const DEFAULT_MEAL_DURATION = 60; // minutes

export const HOURS = Array.from(
  { length: MAX_HOUR - MIN_HOUR + 1 }, 
  (_, i) => MIN_HOUR + i
);

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = [
  'Sunday', 
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
];

import { formatTimeForDisplay, parseTime } from '../../../utils/timeSlots';

export const formatHour = (hour: number): string => {
  return formatTimeForDisplay(`${hour.toString().padStart(2, '0')}:00`);
};

export const timeToMinutes = (time: string): number => {
  const { hour, minute } = parseTime(time);
  return hour * 60 + minute;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getTimePosition = (time: string): number => {
  const minutes = timeToMinutes(time);
  const startMinutes = MIN_HOUR * 60;
  return ((minutes - startMinutes) / 60) * HOUR_HEIGHT;
};