import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useSearchBox } from "../../../context";
import { useRouter } from "next/router";

export const SearchBar = () => {
  const { searchBoxValue = "", onSearchBoxValueChange } = useSearchBox();

  const router = useRouter();
  const path = router.asPath;

  const onSearchBarChange = (
    _ev: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    onSearchBoxValueChange(data.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (path !== "/recipes") {
        // User is not on the home page, reroute
        router.push(`/recipes`);
      }
    }
  };

  return (
    <SearchBox
      value={searchBoxValue}
      onChange={onSearchBarChange}
      appearance="outline"
      placeholder="Search for snacks"
      onKeyDown={handleKeyDown}
    />
  );
};
