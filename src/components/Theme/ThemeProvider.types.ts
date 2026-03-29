/**
 * Defines the possible theme values for the application.
 */
export type Theme = "light" | "dark";

/**
 * Context type for the ThemeProvider, including the current theme and a function to set the theme.
 */
export type ThemeProviderProps = {
  /**
   * The child components that will have access to the theme context.
   */
  children: React.ReactNode;

  /**
   * The current theme of the application.
   */
  theme: Theme;

  /**
   * Function to update the current theme.
   */
  setTheme?: (theme: Theme) => void;
};

/**
 * Defines the shape of the context provided by the ThemeProvider.
 */
export interface ThemeContextType {
  /**
   * The currently active theme.
   */
  theme: Theme;
  /**
   * Function to update the application's theme.
   */
  setTheme?: (theme: Theme) => void;
}
