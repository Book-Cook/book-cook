import * as React from "react";
import { render } from "@testing-library/react";

import { CurrentTimeLine } from "./CurrentTimeLine";

describe('CurrentTimeLine', () => {
  it('should render at the correct position', () => {
    const { container } = render(<CurrentTimeLine position={120} />);
    
    const timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toBeInTheDocument();
    expect(timeLine).toHaveStyle({ top: '120px' });
  });

  it('should render with correct styling', () => {
    const { container } = render(<CurrentTimeLine position={180} />);
    
    const timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toHaveStyle({
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      zIndex: 3,
      pointerEvents: 'none',
    });
  });

  it('should update position when prop changes', () => {
    const { container, rerender } = render(<CurrentTimeLine position={100} />);
    
    let timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toHaveStyle({ top: '100px' });
    
    rerender(<CurrentTimeLine position={200} />);
    
    timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toHaveStyle({ top: '200px' });
  });

  it('should render the time line element', () => {
    const { container } = render(<CurrentTimeLine position={150} />);
    
    const timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toBeInTheDocument();
  });

  it('should handle zero position', () => {
    const { container } = render(<CurrentTimeLine position={0} />);
    
    const timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toBeInTheDocument();
    expect(timeLine).toHaveStyle({ top: '0px' });
  });

  it('should handle negative position', () => {
    const { container } = render(<CurrentTimeLine position={-50} />);
    
    const timeLine = container.querySelector('[data-testid="current-time-line"]');
    expect(timeLine).toBeInTheDocument();
    expect(timeLine).toHaveStyle({ top: '-50px' });
  });
});