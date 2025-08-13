import { renderHook, act } from '@testing-library/react';

import { useVirtualization } from './useVirtualization';

describe('useVirtualization', () => {
  const defaultOptions = {
    itemHeight: 100,
    containerHeight: 500,
    overscan: 3,
    totalItems: 100,
  };

  it('calculates initial visible range correctly', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(11); // Math.min(99, 0 + 5 + 3*2) = 11
    expect(result.current.visibleItems).toBe(5); // 500 / 100
    expect(result.current.totalHeight).toBe(10000); // 100 * 100
    expect(result.current.offsetY).toBe(0);
    expect(result.current.scrollTop).toBe(0);
  });

  it('updates visible range when scrolled', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.handleScroll(1000); // Scroll down
    });

    expect(result.current.startIndex).toBe(7); // Math.max(0, Math.floor(1000/100) - 3)
    expect(result.current.endIndex).toBe(18); // startIndex + visibleItems + overscan * 2
    expect(result.current.offsetY).toBe(700); // 7 * 100
    expect(result.current.scrollTop).toBe(1000);
  });

  it('clamps start index to 0', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.handleScroll(-100); // Negative scroll
    });

    expect(result.current.startIndex).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it('clamps end index to totalItems - 1', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 10, // Small list
    }));

    act(() => {
      result.current.handleScroll(500);
    });

    expect(result.current.endIndex).toBe(9); // Clamped to totalItems - 1
  });

  it('handles different item heights', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      itemHeight: 200,
    }));

    expect(result.current.visibleItems).toBe(3); // Math.ceil(500 / 200)
    expect(result.current.totalHeight).toBe(20000); // 100 * 200

    act(() => {
      result.current.handleScroll(400);
    });

    expect(result.current.startIndex).toBe(0); // Math.max(0, Math.floor(400/200) - 3)
    expect(result.current.endIndex).toBe(9); // Math.min(99, 0 + 3 + 3*2) = 9
  });

  it('handles different container heights', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      containerHeight: 300,
    }));

    expect(result.current.visibleItems).toBe(3); // Math.ceil(300 / 100)
  });

  it('handles custom overscan values', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      overscan: 1,
    }));

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(7); // Math.min(99, 0 + 5 + 1*2) = 7

    act(() => {
      result.current.handleScroll(500);
    });

    expect(result.current.startIndex).toBe(4); // Math.max(0, Math.floor(500/100) - 1)
    expect(result.current.endIndex).toBe(11); // 4 + 5 + 1*2
  });

  it('handles zero overscan', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      overscan: 0,
    }));

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(5); // Math.min(99, 0 + 5 + 0*2) = 5

    act(() => {
      result.current.handleScroll(500);
    });

    expect(result.current.startIndex).toBe(5); // Math.max(0, Math.floor(500/100) - 0)
    expect(result.current.endIndex).toBe(10); // Math.min(99, 5 + 5 + 0*2) = 10
  });

  it('handles empty list', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 0,
    }));

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(-1); // Math.min(0 - 1, ...)
    expect(result.current.totalHeight).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it('handles single item list', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 1,
    }));

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(0);
    expect(result.current.totalHeight).toBe(100);
  });

  it('maintains scroll position across multiple updates', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.handleScroll(750);
    });

    const firstScrollTop = result.current.scrollTop;
    const firstStartIndex = result.current.startIndex;

    act(() => {
      result.current.handleScroll(750); // Same scroll position
    });

    expect(result.current.scrollTop).toBe(firstScrollTop);
    expect(result.current.startIndex).toBe(firstStartIndex);
  });

  it('recalculates when options change', () => {
    const { result, rerender } = renderHook(
      (options) => useVirtualization(options),
      { initialProps: defaultOptions }
    );

    const initialTotalHeight = result.current.totalHeight;

    rerender({
      ...defaultOptions,
      itemHeight: 200, // Changed item height
    });

    expect(result.current.totalHeight).not.toBe(initialTotalHeight);
    expect(result.current.totalHeight).toBe(20000); // 100 * 200
  });
});