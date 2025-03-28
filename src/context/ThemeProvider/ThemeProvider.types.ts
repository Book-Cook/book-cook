import type { Theme } from "@fluentui/react-components";

export type ThemeMode = "light" | "dark";

export type ThemeContextProps = {
  theme: Theme;
  themeMode: ThemeMode;
  primaryColor: string;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
};

export type InitialValues = {
  mode: ThemeMode;
  color: string;
  cachedThemeString: string | null;
};
