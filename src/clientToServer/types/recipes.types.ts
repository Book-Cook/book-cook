export type Recipe = {
  /**
   * The id of the recipe
   */
  _id: string;

  /**
   * The url of the image to display for the recipe.
   */
  imageURL: string;

  /**
   * The title of the recipe.
   */
  title: string;

  /**
   * The date the recipe was created.
   */
  createdAt: string;

  /**
   * The data of the recipe in markdown.
   */
  data: string;

  /**
   * The list of tags for the recipe.
   */
  tags: string[];

  /**
   * Emoji fallback when no image is available.
   */
  emoji: string;

  /**
   * Owner user ID.
   */
  owner: string;

  /**
   * Whether the recipe is publicly visible.
   */
  isPublic: boolean;

  savedCount?: number;
  viewCount?: number;
  publishedAt?: string;
  creatorName?: string;
};

export type CreateRecipeInput = {
  title: string;
  data: string;
  tags: string[];
  imageURL?: string;
};

export type CreateRecipeResponse = {
  message: string;
  recipeId: string;
};
