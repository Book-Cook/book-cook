import { useState, useCallback, useMemo } from 'react';

export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

export interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number;
  scrollTop: number;
  totalHeight: number;
  offsetY: number;
}

export const useVirtualization = ({
  itemHeight,
  containerHeight,
  overscan = 3,
  totalItems,
}: VirtualizationOptions): VirtualizationResult & {
  handleScroll: (scrollTop: number) => void;
} => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  const result = useMemo(() => {
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const totalHeight = totalItems * itemHeight;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems - 1,
      startIndex + visibleItems + overscan * 2
    );
    
    const offsetY = startIndex * itemHeight;

    return {
      startIndex,
      endIndex,
      visibleItems,
      scrollTop,
      totalHeight,
      offsetY,
    };
  }, [itemHeight, containerHeight, overscan, totalItems, scrollTop]);

  return {
    ...result,
    handleScroll,
  };
};