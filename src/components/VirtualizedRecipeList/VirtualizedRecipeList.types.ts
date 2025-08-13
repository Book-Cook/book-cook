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