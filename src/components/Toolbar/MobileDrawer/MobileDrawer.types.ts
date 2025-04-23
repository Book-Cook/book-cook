export type MobileDrawerProps = {
  /**
   * Whether the mobile drawer is open or closed.
   */
  isOpen: boolean;
  /**
   * Callback function to handle the opening and closing of the mobile drawer.
   */
  onOpenChange: (isOpen: boolean) => void;
  /**
   * The current path of the application, used to determine which link is active.
   */
  currentPath: string;
  /**
   * Callback function to handle navigation to a different URL.
   */
  onNavigate: (url: string) => void;

  /**
   * Callback function to handle the opening and closing of the new recipe dialog.
   */
  onNewRecipeDialogOpen: () => void;
};
