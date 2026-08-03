import React from "react";

import type { SearchBoxContextValue } from "./SearchBoxProvider.types";

export const SearchBoxContext = React.createContext<SearchBoxContextValue>({
  searchBoxValue: "",
  onSearchBoxValueChange: () => {},
});

/**
 * Owns the search text itself rather than taking it as a prop. While this state
 * lived in AppContainer every keystroke rebuilt the `<AppShell>` element, so the
 * whole shell re-rendered (measured: 6 renders for 5 typed characters). Holding
 * it here keeps the shell subtree — passed through untouched as `children` —
 * referentially stable, so only genuine `useSearchBox` consumers re-render.
 */
export const SearchBoxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");

  const value = React.useMemo<SearchBoxContextValue>(
    () => ({
      searchBoxValue,
      onSearchBoxValueChange: setSearchBoxValue,
    }),
    [searchBoxValue],
  );

  return (
    <SearchBoxContext.Provider value={value}>
      {children}
    </SearchBoxContext.Provider>
  );
};

export const useSearchBox = () => React.useContext(SearchBoxContext);
