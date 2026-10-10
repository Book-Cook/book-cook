import * as React from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { fetchRecipesPaginated } from "src/clientToServer/fetch/fetchAllRecipes";
import { useFetchAllTags } from "src/clientToServer/fetch/useFetchAllTags";
import styles from "./recipes.module.css";
import { Unauthorized } from "../components";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
  DropdownCaret,
} from "../components/Dropdown";
import { MultiSelectMenu } from "../components/MultiSelectMenu";
import { SearchBox } from "../components/SearchBox";
import { PageTitle, BodyText } from "../components/Typography";
import { VirtualizedRecipeList } from "../components/VirtualizedRecipeList/VirtualizedRecipeList";
import { useRecipeSort, useSearchBox } from "../context";
import { useRecipeGridPageSize } from "../hooks";

export default function Recipes() {
  const { searchBoxValue, onSearchBoxValueChange } = useSearchBox();

  // The box updates on every keystroke; the query waits for a pause in typing
  // so each character does not cost a request
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchBoxValue);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchBoxValue), 250);
    return () => clearTimeout(timer);
  }, [searchBoxValue]);
  const { data: session, status } = useSession();

  const { sortOption, onSortOptionChange } = useRecipeSort();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Rounded to whole rows for the current column count so a full page never
  // leaves empty slots at the end of the grid
  const listRef = React.useRef<HTMLDivElement>(null);
  const measuredPageSize = useRecipeGridPageSize(listRef);
  const pageSize = measuredPageSize ?? 0;

  // When a resize changes the page size, move to the page that holds the
  // first recipe that was showing, so the view does not jump or run past
  // the last page
  const previousPageSizeRef = React.useRef(measuredPageSize);
  React.useEffect(() => {
    const previous = previousPageSizeRef.current;
    previousPageSizeRef.current = measuredPageSize;
    if (!previous || !measuredPageSize || previous === measuredPageSize) {
      return;
    }
    setCurrentPage(
      (page) => Math.floor(((page - 1) * previous) / measuredPageSize) + 1,
    );
  }, [measuredPageSize]);

  // Reset to page 1 whenever search/sort/tags change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortOption, selectedTags]);

  const offset = (currentPage - 1) * pageSize;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "recipes",
      debouncedSearch,
      sortOption,
      selectedTags,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      fetchRecipesPaginated({
        searchBoxValue: debouncedSearch,
        orderBy: sortOption,
        selectedTags,
        offset,
        limit: pageSize,
      }),
    enabled: measuredPageSize !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
  });

  const recipes = data?.recipes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const isSessionLoading = status === "loading";

  // Every tag in the collection, not just those on the recipes this page
  // happens to show
  const { availableTags } = useFetchAllTags();

  // Rendering `null` while the session resolves left the server emitting an
  // empty document and the browser showing a blank screen for a whole auth
  // round trip. The page chrome does not depend on the session, so it paints
  // immediately and only the list waits.
  if (!isSessionLoading && !session) {
    return <Unauthorized />;
  }

  const countLabel = isSessionLoading
    ? "Loading your collection"
    : `${totalCount} recipe${totalCount !== 1 ? "s" : ""}${
        debouncedSearch
          ? ` matching "${debouncedSearch}"`
          : " in your collection"
      }${selectedTags.length > 0 ? ` with tags: ${selectedTags.join(", ")}` : ""}`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <PageTitle as="h1">My Recipes</PageTitle>
        <div className={styles.search}>
          <SearchBox
            placeholder="Search recipes"
            aria-label="Search recipes"
            value={searchBoxValue}
            onChange={(_event, value) => onSearchBoxValueChange(value)}
            contentBefore={<MagnifyingGlassIcon size={16} />}
          />
        </div>
        <div className={styles.toolbar}>
          <BodyText>{countLabel}</BodyText>
          <div className={styles.controls}>
            <Dropdown value={sortOption} onValueChange={onSortOptionChange}>
              <DropdownTrigger>
                <DropdownValue />
                <DropdownCaret />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="dateNewest">
                  Sort by date (newest)
                </DropdownItem>
                <DropdownItem value="dateOldest">
                  Sort by date (oldest)
                </DropdownItem>
                <DropdownItem value="ascTitle">
                  Sort by title (ascending)
                </DropdownItem>
                <DropdownItem value="descTitle">
                  Sort by title (descending)
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
            <MultiSelectMenu
              options={availableTags}
              value={selectedTags}
              onChange={setSelectedTags}
              label="Filter by tags"
            />
          </div>
        </div>
      </div>
      <div ref={listRef}>
        <VirtualizedRecipeList
          recipes={recipes}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          isLoading={isLoading || isSessionLoading || measuredPageSize === null}
          error={error}
          onPageChange={setCurrentPage}
          onPageSizeChange={() => undefined}
        />
      </div>
    </div>
  );
}
