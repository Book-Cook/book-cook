import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useSearchBox } from "../../../context";

export const SearchBar = () => {
  const { searchBoxValue = "", onSearchBoxValueChange } = useSearchBox();

  const onSearchBarChange = (
    _ev: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    onSearchBoxValueChange(data.value);
  };

  return (
    <SearchBox
      value={searchBoxValue}
      onChange={onSearchBarChange}
      appearance="outline"
      placeholder="Search for snacks"
    />
  );
};
