/**
 * useAppTheme — manages the user's theme preference.
 *
 * Stores the preference ("light", "dark", or "system") in localStorage.
 * When "system" is active, ThemeProvider resolves the actual CSS class by
 * listening to the OS prefers-color-scheme media query.
 */
import { useState, useCallback } from "react";

import type { Theme } from "../components/Theme/ThemeProvider.types";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function useAppTheme(): { theme: Theme; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((t: Theme): void => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  return { theme, setTheme };
}
