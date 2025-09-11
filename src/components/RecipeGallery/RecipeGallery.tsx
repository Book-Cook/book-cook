import * as React from "react";
import { Dropdown, Option } from "@fluentui/react-components";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { fetchRecipesPaginated } from "src/clientToServer/fetch/fetchAllRecipes";
import { useStyles } from "./RecipeGallery.styles";
import { Text, Heading1 } from "../Text";
import { SearchBar } from "../Toolbar/SearchBar";
import { VirtualizedRecipeList } from "../VirtualizedRecipeList/VirtualizedRecipeList";

import { Unauthorized } from "..";
import { useSearchBox, RecipeProvider } from "../../context";

export const parsePageQuery = (page: unknown): number => {
  const parsed = Number(page);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

export const RecipeGallery = () => {
  const styles = useStyles();
  const { searchBoxValue } = useSearchBox();
  const { data: session } = useSession();
  const router = useRouter();

  const [sortOption, setSortOption] = React.useState("dateNewest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const {
    data: recipesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "recipes",
      searchBoxValue,
      sortOption,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      fetchRecipesPaginated({
        searchBoxValue,
        orderBy: sortOption,
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
      }),
    placeholderData: (previousData) => previousData,
  });

  const recipes = recipesResponse?.recipes ?? [];
  const totalCount = recipesResponse?.totalCount ?? 0;
  const searchPage = parsePageQuery(router.query.page);

  React.useEffect(() => {
    if (!router.isReady) {return;}
    setCurrentPage(searchPage);
  }, [router.isReady, searchPage]);

  // Reset to page 1 when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchBoxValue, sortOption, selectedTags]);

  React.useEffect(() => {
    const { tag, page } = router.query;
    if (tag && typeof tag === "string") {
      if (!selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
    if (page && typeof page === "string") {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const onSortOptionSelect = (
    _ev: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    if (data.selectedOptions?.[0]) {
      setSortOption(data.selectedOptions[0]);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await router
      .replace(
        {
          query: { ...router.query, page: page.toString() },
        },
        undefined,
        { shallow: true }
      )
      .catch(console.error);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    await router
      .replace(
        {
          query: { ...router.query, page: "1" },
        },
        undefined,
        { shallow: true }
      )
      .catch(console.error);
  };

  if (!session) {
    return <Unauthorized />;
  }

  return (
    <RecipeProvider>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Heading1>My Recipes</Heading1>
            <Text
              size={200}
              weight="medium"
              style={{ color: "var(--colorNeutralForeground2)" }}
            >
              {totalCount} recipes{" "}
              {searchBoxValue
                ? `matching "${searchBoxValue}"`
                : "in your collection"}
            </Text>
          </div>
          <div className={styles.controlsRow}>
            <div className={styles.searchWrapper}>
              <SearchBar />
            </div>
            <TagPicker
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
            <Dropdown
              className={styles.sortDropdown}
              appearance="outline"
              onOptionSelect={onSortOptionSelect}
              defaultSelectedOptions={["dateNewest"]}
              defaultValue={"Sort by date (newest)"}
            >
              <Option value={"dateNewest"}>Sort by date (newest)</Option>
              <Option value={"dateOldest"}>Sort by date (oldest)</Option>
              <Option value={"ascTitle"}>Sort by title (asc)</Option>
              <Option value={"descTitle"}>Sort by title (desc)</Option>
            </Dropdown>

          </div>
        </div>

        <VirtualizedRecipeList
          recipes={recipes}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          isLoading={isLoading}
          error={error as Error}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          emptyStateMessage="No recipes found in your collection."
          loadingMessage="Loading your recipes..."
        />
      </div>
    </RecipeProvider>
  );
};
