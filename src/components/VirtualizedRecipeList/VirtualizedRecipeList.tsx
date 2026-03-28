import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

import { PaginationControls } from '../PaginationControls/PaginationControls';
import { RecipeCard } from '../RecipeCard';
import { Spinner } from "../Spinner";
import { Text } from "../Text";

import type { Recipe } from '../../clientToServer/types';

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

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
    padding: `0 ${tokens.spacingHorizontalM}`,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXXL,
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    gap: tokens.spacingVerticalM,
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    color: tokens.colorPaletteRedForeground1,
  },
  fadeIn: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  cardWrapper: {
    transition: `transform ${tokens.durationNormal} ${tokens.curveEasyEase}`,
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
});

export const VirtualizedRecipeList: React.FC<VirtualizedRecipeListProps> = ({
  recipes,
  totalCount,
  currentPage,
  pageSize,
  isLoading = false,
  error = null,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  emptyStateMessage = 'No recipes found.',
  loadingMessage = 'Loading recipes...',
}) => {
  const styles = useStyles();
  
  
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
          {error.message || 'Failed to load recipes. Please try again.'}
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
        <Text size={300}>
          Try adjusting your search criteria or filters.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {recipes.map((recipe, index) => (
          <div
            key={recipe._id}
            className={`${styles.fadeIn} ${styles.cardWrapper}`}
            style={{
              '--fadeInDelay': `${Math.min(index * 0.1, 0.3)}s`,
            } as React.CSSProperties}
          >
            <RecipeCard
              title={recipe.title}
              id={recipe._id}
              emoji={recipe.emoji || '🍽️'}
              imageSrc={recipe.imageURL}
              tags={recipe.tags}
              createdDate={recipe.createdAt}
              isPublic={recipe.isPublic}
              creatorName={recipe.creatorName}
              savedCount={recipe.savedCount}
              showActions={!recipe.creatorName}
            />
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
