export interface PublicRecipe {
  _id: string;
  title: string;
  tags: string[];
  createdAt: string;
  emoji: string;
  imageURL: string;
  savedCount: number;
  viewCount: number;
  creatorName: string;
  owner: string;
  data: string;
  isPublic: boolean;
}

export interface PublicRecipesResponse {
  recipes: PublicRecipe[];
  totalCount: number;
  hasMore: boolean;
}

export const fetchPublicRecipes = async (params: {
  search?: string;
  tags?: string[];
  sortProperty?: string;
  sortDirection?: string;
  offset?: number;
  limit?: number;
}): Promise<PublicRecipesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.append("search", params.search);
  }
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => searchParams.append("tags", tag));
  }
  if (params.sortProperty) {
    searchParams.append("sortProperty", params.sortProperty);
  }
  if (params.sortDirection) {
    searchParams.append("sortDirection", params.sortDirection);
  }
  if (params.offset) {
    searchParams.append("offset", params.offset.toString());
  }
  if (params.limit) {
    searchParams.append("limit", params.limit.toString());
  }

  const response = await fetch(
    `/api/recipes/public?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch public recipes");
  }

  return response.json();
};
