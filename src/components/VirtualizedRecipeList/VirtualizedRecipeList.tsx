import * as React from "react";

import styles from "./VirtualizedRecipeList.module.css";
import { PaginationControls } from "../PaginationControls/PaginationControls";
import { RecipeCard } from "../RecipeCard";
import { Spinner } from "../Spinner";
import { Text } from "../Text";

import type { Recipe } from "../../clientToServer/types";

export interface VirtualizedRecipeListProps {
  recipes: Recipe[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  emptyStateMessage?: string;
  loadingMessage?: string;
}

export const VirtualizedRecipeList: React.FC<VirtualizedRecipeListProps> = ({
  recipes,
  totalCount,
  currentPage,
  pageSize,
  isLoading = false,
  error = null,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  emptyStateMessage = "No recipes found.",
  loadingMessage = "Loading recipes...",
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Spinner size="large" />
        <Text size={300}>{loadingMessage}</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <Text size={400} weight="semibold">
          Something went wrong
        </Text>
        <Text size={300}>
          {error.message || "Failed to load recipes. Please try again."}
        </Text>
      </div>
    );
  }

  if (!recipes.length && totalCount === 0) {
    return (
      <div className={styles.emptyState}>
        <Text size={400} weight="semibold">
          {emptyStateMessage}
        </Text>
        <Text size={300}>Try adjusting your search criteria or filters.</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {recipes.map((recipe, index) => (
          <div
            key={recipe._id}
            className={styles.cardWrapper}
            style={
              {
                "--fadeInDelay": `${Math.min(index * 0.1, 0.3)}s`,
              } as React.CSSProperties
            }
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
