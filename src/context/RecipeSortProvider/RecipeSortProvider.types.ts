export type RecipeSortContextValue = {
  /**
   * The recipes gallery sort option, e.g. "dateNewest" or "ascTitle".
   */
  sortOption: string;

  /**
   * Callback function to be called when the sort option changes.
   */
  onSortOptionChange: (incomingValue: string) => void;
};
