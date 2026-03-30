/**
 * useAppTheme — manages the app theme with system preference detection.
 *
 * Priority order:
 *   1. Explicit user preference stored in localStorage
 *   2. OS/browser prefers-color-scheme media query
 *
 * When no explicit preference is stored, the hook also listens for
 * system preference changes and follows them automatically.
 * Setting a theme via `setTheme` stores the choice and stops following
 * the system preference.
 */
import { useState, useEffect, useCallback, useRef } from "react";

import type { Theme } from "../components/Theme/ThemeProvider.types";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useAppTheme(): { theme: Theme; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Track whether the user has set an explicit preference so the system
  // listener knows whether to follow OS changes.
  const hasStoredPref = useRef(
    typeof window !== "undefined" && Boolean(localStorage.getItem(STORAGE_KEY))
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent): void => {
      if (!hasStoredPref.current) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []); // mount once — handler reads hasStoredPref via ref, no stale closure

  const setTheme = useCallback((t: Theme): void => {
    localStorage.setItem(STORAGE_KEY, t);
    hasStoredPref.current = true;
    setThemeState(t);
  }, []);

  return { theme, setTheme };
}
