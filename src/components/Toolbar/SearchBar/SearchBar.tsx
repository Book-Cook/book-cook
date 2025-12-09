import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useRouter } from "next/router";

import { useSearchBox } from "../../../context";
import { useDebounce } from "../../../hooks";
import type { SearchBarProps } from "./SearchBar.types";

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { searchBoxValue = "", onSearchBoxValueChange } = useSearchBox();

  const [inputValue, setInputValue] = React.useState(searchBoxValue);
  const debouncedValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    onSearchBoxValueChange(debouncedValue);
  }, [debouncedValue, onSearchBoxValueChange]);

  React.useEffect(() => {
    setInputValue(searchBoxValue);
  }, [searchBoxValue]);

  const router = useRouter();
  const path = router.asPath;

  const onSearchBarChange = (
    _ev: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    setInputValue(data.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      // Immediately update the shared search value so that navigating
      // to the recipes page reflects the typed query even if the
      // debounced update has not fired yet.
      onSearchBoxValueChange(inputValue);

      if (path !== "/recipes") {
        // User is not on the home page, reroute
        await router.push(`/recipes`);
      }

      onSearch?.();
    }
  };

  return (
    <SearchBox
      value={inputValue}
      onChange={onSearchBarChange}
      appearance="outline"
      placeholder="Search recipes or tags"
      onKeyDown={handleKeyDown}
    />
  );
};
