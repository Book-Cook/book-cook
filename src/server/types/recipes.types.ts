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
};
