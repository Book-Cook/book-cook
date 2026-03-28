import { useState, useCallback } from 'react';

import type { CalendarView, DateRange } from '../types';
import { navigateDate, getWeekRange, getMonthRange, formatDateForAPI } from '../utils/calendarUtils';

export function useCalendarNavigation(initialDate = new Date(), initialView: CalendarView = 'week') {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);

  const handlePrevious = useCallback(() => {
    setCurrentDate(current => navigateDate(current, 'prev', view));
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate(current => navigateDate(current, 'next', view));
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const getDateRange = useCallback((): DateRange => {
    let start: Date;
    let end: Date;

    switch (view) {
      case 'day':
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(currentDate);
        end.setHours(23, 59, 59, 999);
        break;
        
      case 'week':
        ({ start, end } = getWeekRange(currentDate));
        break;
        
      case 'month':
        ({ start, end } = getMonthRange(currentDate));
        break;
        
      default:
        start = end = new Date(currentDate);
    }

    return {
      startDate: formatDateForAPI(start),
      endDate: formatDateForAPI(end),
    };
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    setView,
    setCurrentDate,
    handlePrevious,
    handleNext,
    handleToday,
    getDateRange,
    dateRange: getDateRange(),
  };
}