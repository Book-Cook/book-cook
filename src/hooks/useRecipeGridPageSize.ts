import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

import {
  getFullRowPageSize,
  getRecipeGridColumnCount,
  TARGET_RECIPES_PER_PAGE,
} from "../components/VirtualizedRecipeList/gridLayout";

/**
 * Page size for a recipe grid rendered inside `containerRef`, rounded so a
 * full page fills its last row at the current column count. Re-measures on
 * resize. Returns `null` until the container has been measured, so callers
 * can hold the fetch instead of requesting a page size they then discard.
 */
export const useRecipeGridPageSize = (
  containerRef: RefObject<HTMLElement | null>,
): number | null => {
  const [pageSize, setPageSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      setPageSize(TARGET_RECIPES_PER_PAGE);
      return undefined;
    }

    const update = (width: number): void => {
      setPageSize(getFullRowPageSize(getRecipeGridColumnCount(width)));
    };

    update(element.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  return pageSize;
};
