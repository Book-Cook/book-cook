import { formatDateString } from './formatDateString';
import { getCurrentTimePosition } from './getCurrentTimePosition';
import { getInitialScrollPosition } from './getInitialScrollPosition';
import { getWeekDates } from './getWeekDates';
import { isPastDate, isToday } from './monthCalendarUtils';

describe('dateUtils', () => {
  describe('getWeekDates', () => {
    it('should return 7 dates starting from Sunday', () => {
      const date = new Date('2024-01-15'); // Monday
      const weekDates = getWeekDates(date);
      
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDay()).toBe(0); // Sunday
      expect(weekDates[6].getDay()).toBe(6); // Saturday
    });

    it('should handle date already on Sunday', () => {
      const sunday = new Date('2024-01-14'); // Sunday
      const weekDates = getWeekDates(sunday);
      
      expect(weekDates[0].getDay()).toBe(0); // First day is Sunday
      expect(weekDates).toHaveLength(7);
      // Should include the input Sunday date within the week
      expect(weekDates.some(date => date.toDateString() === sunday.toDateString())).toBe(true);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isPastDate(pastDate)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isPastDate(today)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isPastDate(futureDate)).toBe(false);
    });
  });

  describe('formatDateString', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T12:30:00');
      expect(formatDateString(date)).toBe('2024-01-15');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2024-03-05T00:00:00');
      expect(formatDateString(date)).toBe('2024-03-05');
    });
  });

  describe('getCurrentTimePosition', () => {
    it('should return null for hours before minHour', () => {
      const earlyTime = new Date();
      earlyTime.setHours(5, 30); // 5:30 AM
      const position = getCurrentTimePosition(earlyTime, 6, 60);
      expect(position).toBeNull();
    });

    it('should return null for hours after 10 PM', () => {
      const lateTime = new Date();
      lateTime.setHours(23, 0); // 11:00 PM
      const position = getCurrentTimePosition(lateTime, 6, 60);
      expect(position).toBeNull();
    });

    it('should calculate correct position for valid time', () => {
      const time = new Date();
      time.setHours(9, 0); // 9:00 AM
      const position = getCurrentTimePosition(time, 6, 60);
      expect(position).toBe(180); // 3 hours * 60 pixels
    });

    it('should handle minutes correctly', () => {
      const time = new Date();
      time.setHours(9, 30); // 9:30 AM
      const position = getCurrentTimePosition(time, 6, 60);
      expect(position).toBe(210); // 3.5 hours * 60 pixels
    });
  });

  describe('getInitialScrollPosition', () => {
    it('should calculate scroll position based on current time', () => {
      const originalDate = Date;
      const mockDate = new Date('2024-01-15T09:00:00');
      
      global.Date = jest.fn(() => mockDate) as typeof Date;
      global.Date.now = originalDate.now;
      
      const scrollPosition = getInitialScrollPosition(6, 60);
      expect(scrollPosition).toBe(60); // ((9*60 - 6*60 - 120) / 60) * 60 = ((540 - 360 - 120) / 60) * 60 = (60/60) * 60 = 60
      
      global.Date = originalDate;
    });

    it('should return 0 for very early times', () => {
      const originalDate = Date;
      const mockDate = new Date('2024-01-15T04:00:00'); // Very early time
      
      global.Date = jest.fn(() => mockDate) as typeof Date;
      global.Date.now = originalDate.now;
      
      const scrollPosition = getInitialScrollPosition(6, 60);
      expect(scrollPosition).toBe(0); // Should be 0 for negative positions
      
      global.Date = originalDate;
    });
  });
});