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

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.visibleRange.end).toBe(8); // ceil(500/100) + 3 overscan
    expect(result.current.totalHeight).toBe(10000); // 100 * 100
    expect(result.current.offsetY).toBe(0);
  });

  it('updates visible range when scrolled', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.onScroll(1000); // Scroll down
    });

    expect(result.current.visibleRange.start).toBe(7); // floor(1000/100) - 3 overscan
    expect(result.current.visibleRange.end).toBe(18); // ceil((1000+500)/100) + 3 overscan
    expect(result.current.offsetY).toBe(700); // 7 * 100
  });

  it('clamps start index to 0', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.onScroll(-100); // Negative scroll
    });

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it('clamps end index to totalItems - 1', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 10, // Small list
    }));

    act(() => {
      result.current.onScroll(500);
    });

    expect(result.current.visibleRange.end).toBe(9); // Clamped to totalItems - 1
  });

  it('handles different item heights', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      itemHeight: 200,
    }));

    expect(result.current.totalHeight).toBe(20000); // 100 * 200

    act(() => {
      result.current.onScroll(400);
    });

    expect(result.current.visibleRange.start).toBe(0); // floor(400/200) - 3 = -1, clamped to 0
    expect(result.current.visibleRange.end).toBe(8); // ceil((400+500)/200) + 3
  });

  it('handles different container heights', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      containerHeight: 300,
    }));

    expect(result.current.visibleRange.end).toBe(6); // ceil(300/100) + 3
  });

  it('handles custom overscan values', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      overscan: 1,
    }));

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.visibleRange.end).toBe(6); // ceil(500/100) + 1

    act(() => {
      result.current.onScroll(500);
    });

    expect(result.current.visibleRange.start).toBe(4); // floor(500/100) - 1
    expect(result.current.visibleRange.end).toBe(11); // ceil((500+500)/100) + 1
  });

  it('handles zero overscan', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      overscan: 0,
    }));

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.visibleRange.end).toBe(5); // ceil(500/100)

    act(() => {
      result.current.onScroll(500);
    });

    expect(result.current.visibleRange.start).toBe(5); // floor(500/100)
    expect(result.current.visibleRange.end).toBe(10); // ceil((500+500)/100)
  });

  it('handles empty list', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 0,
    }));

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.visibleRange.end).toBe(-1); // min(0-1, ...)
    expect(result.current.totalHeight).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it('handles single item list', () => {
    const { result } = renderHook(() => useVirtualization({
      ...defaultOptions,
      totalItems: 1,
    }));

    expect(result.current.visibleRange.start).toBe(0);
    expect(result.current.visibleRange.end).toBe(0);
    expect(result.current.totalHeight).toBe(100);
  });

  it('maintains scroll position across multiple updates', () => {
    const { result } = renderHook(() => useVirtualization(defaultOptions));

    act(() => {
      result.current.onScroll(750);
    });

    const firstStart = result.current.visibleRange.start;

    act(() => {
      result.current.onScroll(750); // Same scroll position
    });

    expect(result.current.visibleRange.start).toBe(firstStart);
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