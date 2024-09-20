export type SearchBoxContextValue = {
  /**
   * The current value of the search box.
   */
  searchBoxValue: string;

  /**
   * Callback function to be called when the search box value changes.
   */
  onSearchBoxValueChange: (incomingValue: string) => void;
};
