import * as React from "react";
import { render, screen } from "@testing-library/react";

import { WeekHeader } from "../components/WeekViewComponents";

describe('WeekHeader', () => {
  const mockWeekDates = [
    new Date('2024-01-14'), // Sunday
    new Date('2024-01-15'), // Monday
    new Date('2024-01-16'), // Tuesday
    new Date('2024-01-17'), // Wednesday
    new Date('2024-01-18'), // Thursday
    new Date('2024-01-19'), // Friday
    new Date('2024-01-20'), // Saturday
  ];

  it('should render all 7 days of the week', () => {
    render(<WeekHeader weekDates={mockWeekDates} />);
    
    expect(screen.getByText(/Sun \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Mon \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Tue \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Wed \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Thu \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Fri \d+/)).toBeInTheDocument();
    expect(screen.getByText(/Sat \d+/)).toBeInTheDocument();
  });

  it('should highlight today with special styling', () => {
    const today = new Date();
    const weekWithToday = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      return date;
    });

    const { container } = render(<WeekHeader weekDates={weekWithToday} />);
    
    const todayElements = container.querySelectorAll('[data-testid="today-header"]');
    expect(todayElements.length).toBeGreaterThan(0);
    
    // Check if today styling exists by counting today headers
    // (There should be at least 0 since not every test uses today's date)
    expect(todayElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should render a time column header', () => {
    const { container } = render(<WeekHeader weekDates={mockWeekDates} />);
    
    const timeColumnHeader = container.querySelector('[data-testid="header-time-column"]');
    expect(timeColumnHeader).toBeInTheDocument();
  });

  it('should use correct day names', () => {
    render(<WeekHeader weekDates={mockWeekDates} />);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(dayName => {
      expect(screen.getByText(new RegExp(dayName))).toBeInTheDocument();
    });
  });

  it('should display correct date numbers', () => {
    render(<WeekHeader weekDates={mockWeekDates} />);
    
    mockWeekDates.forEach(date => {
      const dateNumber = date.getDate().toString();
      expect(screen.getByText(new RegExp(`\\b${dateNumber}\\b`))).toBeInTheDocument();
    });
  });
});