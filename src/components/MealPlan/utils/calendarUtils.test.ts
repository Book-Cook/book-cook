import {
  getCalendarDays,
  isToday,
  isPast,
  isCurrentMonth,
  getWeekRange,
  getMonthRange,
  formatDateForAPI,
  navigateDate,
} from './calendarUtils';

describe('calendarUtils', () => {
  describe('getCalendarDays', () => {
    it('should return 42 days (6 weeks)', () => {
      const date = new Date('2024-01-15');
      const days = getCalendarDays(date);
      expect(days).toHaveLength(42);
    });

    it('should start with Sunday', () => {
      const date = new Date('2024-01-15'); // Monday
      const days = getCalendarDays(date);
      expect(days[0].getDay()).toBe(0); // Sunday
    });

    it('should include the current month', () => {
      const date = new Date('2024-01-15');
      const days = getCalendarDays(date);
      const monthDays = days.filter(day => day.getMonth() === date.getMonth());
      expect(monthDays.length).toBe(31); // January has 31 days
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
  });

  describe('isPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isPast(pastDate)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isPast(today)).toBe(false);
    });

    it('should return false for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isPast(future)).toBe(false);
    });
  });

  describe('isCurrentMonth', () => {
    it('should return true for same month', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-20');
      expect(isCurrentMonth(date1, date2)).toBe(true);
    });

    it('should return false for different months', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-02-15');
      expect(isCurrentMonth(date1, date2)).toBe(false);
    });
  });

  describe('getWeekRange', () => {
    it('should return week starting Sunday', () => {
      const wednesday = new Date('2024-01-17'); // Wednesday
      const { start, end } = getWeekRange(wednesday);
      
      expect(start.getDay()).toBe(0); // Sunday
      expect(end.getDay()).toBe(6); // Saturday
      expect(start.getDate()).toBe(14); // Jan 14, 2024 is Sunday
      expect(end.getDate()).toBe(20); // Jan 20, 2024 is Saturday
    });
  });

  describe('getMonthRange', () => {
    it('should return first and last day of month', () => {
      const date = new Date('2024-01-15');
      const { start, end } = getMonthRange(date);
      
      expect(start.getDate()).toBe(1);
      expect(end.getDate()).toBe(31);
      expect(start.getMonth()).toBe(0); // January
      expect(end.getMonth()).toBe(0); // January
    });
  });

  describe('formatDateForAPI', () => {
    it('should format as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T12:30:00');
      expect(formatDateForAPI(date)).toBe('2024-01-15');
    });
  });

  describe('navigateDate', () => {
    it('should navigate day correctly', () => {
      const date = new Date('2024-01-15');
      
      const nextDay = navigateDate(date, 'next', 'day');
      expect(nextDay.getDate()).toBe(16);
      
      const prevDay = navigateDate(date, 'prev', 'day');
      expect(prevDay.getDate()).toBe(14);
    });

    it('should navigate week correctly', () => {
      const date = new Date('2024-01-15');
      
      const nextWeek = navigateDate(date, 'next', 'week');
      expect(nextWeek.getDate()).toBe(22);
      
      const prevWeek = navigateDate(date, 'prev', 'week');
      expect(prevWeek.getDate()).toBe(8);
    });

    it('should navigate month correctly', () => {
      const date = new Date('2024-01-15');
      
      const nextMonth = navigateDate(date, 'next', 'month');
      expect(nextMonth.getMonth()).toBe(1); // February
      
      const prevMonth = navigateDate(date, 'prev', 'month');
      expect(prevMonth.getMonth()).toBe(11); // December (previous year)
    });
  });
});