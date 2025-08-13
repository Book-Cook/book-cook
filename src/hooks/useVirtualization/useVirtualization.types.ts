export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

export interface VirtualizationResult {
  visibleRange: {
    start: number;
    end: number;
  };
  totalHeight: number;
  offsetY: number;
  onScroll: (scrollTop: number) => void;
}