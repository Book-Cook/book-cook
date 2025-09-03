import * as React from "react";
import { render, screen } from "@testing-library/react";

import { TimeColumn } from "./TimeColumn";

describe('TimeColumn', () => {
  it('should render all hours from 6 AM to 10 PM', () => {
    render(<TimeColumn />);
    
    expect(screen.getByText('6 AM')).toBeInTheDocument();
    expect(screen.getByText('7 AM')).toBeInTheDocument();
    expect(screen.getByText('8 AM')).toBeInTheDocument();
    expect(screen.getByText('9 AM')).toBeInTheDocument();
    expect(screen.getByText('10 AM')).toBeInTheDocument();
    expect(screen.getByText('11 AM')).toBeInTheDocument();
    expect(screen.getByText('12 PM')).toBeInTheDocument();
    expect(screen.getByText('1 PM')).toBeInTheDocument();
    expect(screen.getByText('2 PM')).toBeInTheDocument();
    expect(screen.getByText('3 PM')).toBeInTheDocument();
    expect(screen.getByText('4 PM')).toBeInTheDocument();
    expect(screen.getByText('5 PM')).toBeInTheDocument();
    expect(screen.getByText('6 PM')).toBeInTheDocument();
    expect(screen.getByText('7 PM')).toBeInTheDocument();
    expect(screen.getByText('8 PM')).toBeInTheDocument();
    expect(screen.getByText('9 PM')).toBeInTheDocument();
    expect(screen.getByText('10 PM')).toBeInTheDocument();
  });

  it('should render 17 time slots', () => {
    const { container } = render(<TimeColumn />);
    
    const timeSlots = container.querySelectorAll('[data-testid="time-slot"]');
    expect(timeSlots).toHaveLength(17); // 6 AM to 10 PM inclusive
  });

  it('should apply correct styles to time labels', () => {
    const { container } = render(<TimeColumn />);
    
    const timeLabels = container.querySelectorAll('[data-testid="time-label"]');
    expect(timeLabels.length).toBeGreaterThan(0);
    
    timeLabels.forEach(label => {
      expect(label).toHaveStyle({ transform: 'translateY(-50%)' });
    });
  });

  it('should position time slots correctly', () => {
    const { container } = render(<TimeColumn />);
    
    const timeSlots = container.querySelectorAll('[data-testid="time-slot"]');
    
    timeSlots.forEach((slot, index) => {
      const expectedTop = index * 60; // HOUR_HEIGHT = 60
      expect(slot).toHaveStyle({ top: `${expectedTop}px` });
    });
  });

  it('should have sticky positioning', () => {
    const { container } = render(<TimeColumn />);
    
    const timeColumn = container.querySelector('[data-testid="time-column"]');
    expect(timeColumn).toHaveStyle({
      position: 'sticky',
      left: 0,
      zIndex: 1,
    });
  });
});