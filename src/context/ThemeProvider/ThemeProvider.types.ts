import type { Theme } from "@fluentui/react-components";

export type ThemeMode = "light" | "dark";

export type ThemePreference = ThemeMode | "system";

export type InitialValues = {
  preference: ThemePreference;
  color: string;
  cachedThemeString: string | null;
};

export type ThemeContextProps = {
  theme: Theme;
  appliedThemeMode: ThemeMode;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};
