import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useRouter } from "next/router";

import { useSearchBox } from "../../../context";
import { useDebounce } from "../../../hooks";

export type SearchBarProps = {
  /**
   * Optional callback fired when the user submits a search.
   */
  onSearch?: () => void;
};

const SearchBarComponent = ({ onSearch }: SearchBarProps) => {
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
      placeholder="Search for snacks"
      onKeyDown={handleKeyDown}
    />
  );
};

export const SearchBar = React.memo(SearchBarComponent);
