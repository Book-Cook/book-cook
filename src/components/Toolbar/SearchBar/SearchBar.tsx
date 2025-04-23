import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useRouter } from "next/router";

import { useSearchBox } from "../../../context";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      if (path !== "/recipes") {
        // User is not on the home page, reroute
        await router.push(`/recipes`);
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
