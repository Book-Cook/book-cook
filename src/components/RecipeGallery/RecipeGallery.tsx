import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { fetchRecipesPaginated } from "src/clientToServer/fetch/fetchAllRecipes";
import type { RecipesResponse } from "src/clientToServer/fetch/fetchAllRecipes";
import styles from "./RecipeGallery.module.css";
import {
  Dropdown,
  DropdownCaret,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "../Dropdown";
import { Text, Heading1 } from "../Text";
import { SearchBar } from "../Toolbar/SearchBar";
import { VirtualizedRecipeList } from "../VirtualizedRecipeList/VirtualizedRecipeList";

import { Unauthorized } from "..";
import { useSearchBox, RecipeProvider } from "../../context";

export const parsePageQuery = (page: unknown): number => {
  const parsed = Number(page);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

interface RecipeGalleryProps {
  initialPage?: number;
}

export const RecipeGallery: React.FC<RecipeGalleryProps> = ({
  initialPage,
}) => {
  const { searchBoxValue } = useSearchBox();
  const { data: session } = useSession();
  const router = useRouter();

  const [sortOption, setSortOption] = React.useState("dateNewest");
  const [currentPage, setCurrentPage] = React.useState<number>(
    initialPage ?? 1
  );
  const pageSize = 20;

  const {
    data: recipesResponse,
    isLoading,
    error,
  } = useQuery<RecipesResponse | undefined, Error>({
    queryKey: ["recipes", searchBoxValue, sortOption, currentPage, pageSize],
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
    if (!router.isReady) {
      return;
    }
    setCurrentPage(searchPage);
  }, [router.isReady, searchPage, router.query.pageSize]);

  // Reset to page 1 when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchBoxValue, sortOption]);

  React.useEffect(() => {
    const { page } = router.query;
    if (page && typeof page === "string") {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
  }, [router.query]);

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
            <div className={styles.sortDropdown}>
              <Dropdown
                value={sortOption}
                onValueChange={(val) => setSortOption(val)}
                defaultValue="dateNewest"
              >
                <DropdownTrigger fullWidth>
                  <DropdownValue />
                  <DropdownCaret />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="dateNewest">Sort by date (newest)</DropdownItem>
                  <DropdownItem value="dateOldest">Sort by date (oldest)</DropdownItem>
                  <DropdownItem value="ascTitle">Sort by title (asc)</DropdownItem>
                  <DropdownItem value="descTitle">Sort by title (desc)</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
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
          onPageSizeChange={() => {}}
          emptyStateMessage="No recipes found in your collection."
          loadingMessage="Loading your recipes..."
        />
      </div>
    </RecipeProvider>
  );
};
