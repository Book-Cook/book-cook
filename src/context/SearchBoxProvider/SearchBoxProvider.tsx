import React from "react";

import type { SearchBoxContextValue } from "./SearchBoxProvider.types";

export const SearchBoxContext = React.createContext<SearchBoxContextValue>({
  searchBoxValue: "",
  onSearchBoxValueChange: () => {},
});

export const SearchBoxProvider = SearchBoxContext.Provider;

export const useSearchBox = () => React.useContext(SearchBoxContext);
