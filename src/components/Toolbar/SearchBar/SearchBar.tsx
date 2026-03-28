import * as React from "react";

import type { SearchBarProps } from "./SearchBar.types";

import { useSearchBox } from "../../../context";
import { SearchBox } from "../../Searchbox";

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { searchBoxValue, onSearchBoxValueChange } = useSearchBox();

  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    onSearchBoxValueChange(value);
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <SearchBox
      placeholder="Search recipes or tags"
      value={searchBoxValue}
      onChange={handleChange}
    />
  );
};
