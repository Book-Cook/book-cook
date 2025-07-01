export type RecipeCardProps = {
  /**
   * The title of the recipe
   */
  title: string;

  /**
   *  The image src to render for the recipe card.
   */
  imageSrc?: string;

  /**
   * The list of tags to render for the recipe card.
   */
  tags?: string[];

  /**
   * The date the recipe was created
   */
  createdDate: string;

  /**
   * The id of the recipe to navigate to
   */
  id: string;

  /**
   * The emoji to render for the recipe card.
   */
  emoji: string;

  /**
   * Whether to render the card in a minimal style.
   */
  isMinimal?: boolean;

  /**
   * Whether the recipe card is public or not.
   */
  isPublic?: boolean;

  /**
   * Creator name for public recipes (shows instead of date)
   */
  creatorName?: string;

  /**
   * Number of saves for public recipes
   */
  savedCount?: number;

  /**
   * Whether to show the edit menu (hide for other users' public recipes)
   */
  showActions?: boolean;
};
