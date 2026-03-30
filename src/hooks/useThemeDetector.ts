/**
 * useThemeDetector — returns whether the OS dark mode preference is active.
 * Uses a stable listener (no stale closure) by keeping the handler inside
 * the effect so it only registers once.
 */
import { useState, useEffect } from "react";

export const useThemeDetector = (): boolean => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (ev: MediaQueryListEvent): void => {
      setIsDarkTheme(ev.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []); // mount once — handler is defined inside effect, no stale closure

  return isDarkTheme;
};
