import type { CSSProperties } from "react";

/**
 * Geometry of the recipe card grid. The grid's CSS reads these through
 * custom properties (see `recipeGridStyle`), so the column count computed
 * here always matches what the browser lays out.
 */
export const RECIPE_CARD_MIN_WIDTH = 280;
export const RECIPE_GRID_GAP = 16;
export const RECIPE_GRID_PADDING_INLINE = 8;

/** Roughly how many recipes a page shows before rounding to full rows. */
export const TARGET_RECIPES_PER_PAGE = 20;

export const recipeGridStyle = {
  "--recipe-card-min-width": `${RECIPE_CARD_MIN_WIDTH}px`,
  "--recipe-grid-gap": `${RECIPE_GRID_GAP}px`,
  "--recipe-grid-padding-inline": `${RECIPE_GRID_PADDING_INLINE}px`,
} as CSSProperties;

/**
 * Number of columns `repeat(auto-fill, minmax(min, 1fr))` produces for a grid
 * whose container is `width` pixels wide.
 */
export const getRecipeGridColumnCount = (width: number): number => {
  const available = width - RECIPE_GRID_PADDING_INLINE * 2;
  return Math.max(
    1,
    Math.floor(
      (available + RECIPE_GRID_GAP) / (RECIPE_CARD_MIN_WIDTH + RECIPE_GRID_GAP),
    ),
  );
};

/**
 * Smallest page size of at least `TARGET_RECIPES_PER_PAGE` that fills every
 * row, so a full page never leaves empty slots in its last row.
 */
export const getFullRowPageSize = (columns: number): number =>
  Math.ceil(TARGET_RECIPES_PER_PAGE / columns) * columns;
