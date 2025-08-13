import { useState, useCallback, useMemo } from 'react';

import type { VirtualizationOptions, VirtualizationResult } from './useVirtualization.types';

/**
 * Hook for implementing virtual scrolling in lists.
 * Calculates which items should be visible based on scroll position.
 */
export const useVirtualization = ({
  itemHeight,
  containerHeight,
  overscan = 3,
  totalItems,
}: VirtualizationOptions): VirtualizationResult => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
    
    // Add overscan items for smoother scrolling
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(totalItems - 1, visibleEnd + overscan);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, totalItems]);

  const totalHeight = totalItems * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const onScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    visibleRange,
    totalHeight,
    offsetY,
    onScroll,
  };
};