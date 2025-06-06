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
   *  The title of the recipe.
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
   * The emoji icon for the recipe. Used as a fallback for the image.
   * If the image is not available, this emoji will be displayed.
   */
  emoji: string;

  /**
   * The owner of the recipe.
   */
  owner: string;

  /**
   * Whether the recipe is public or not.
   */
  isPublic: boolean
};

export type UpdateRecipePayload = {
  title: string;
  data: string;
  tags: string[];
  imageURL: string;
  emoji: string;
  isPublic: boolean;
};

export type CreateRecipeResponse = { message: string; recipeId: string };
