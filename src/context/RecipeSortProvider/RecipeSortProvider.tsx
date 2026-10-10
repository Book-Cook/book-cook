import React from "react";

import type { RecipeSortContextValue } from "./RecipeSortProvider.types";

export const DEFAULT_RECIPE_SORT = "dateNewest";

export const RecipeSortContext = React.createContext<RecipeSortContextValue>({
  sortOption: DEFAULT_RECIPE_SORT,
  onSortOptionChange: () => {},
});

/**
 * Holds the recipes gallery sort above the page so it survives navigation.
 * As local state on the page it reset to the default every time the user
 * opened a recipe and came back, because leaving the route unmounts the page.
 */
export const RecipeSortProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sortOption, setSortOption] = React.useState(DEFAULT_RECIPE_SORT);

  const value = React.useMemo<RecipeSortContextValue>(
    () => ({
      sortOption,
      onSortOptionChange: setSortOption,
    }),
    [sortOption],
  );

  return (
    <RecipeSortContext.Provider value={value}>
      {children}
    </RecipeSortContext.Provider>
  );
};

export const useRecipeSort = (): RecipeSortContextValue =>
  React.useContext(RecipeSortContext);
