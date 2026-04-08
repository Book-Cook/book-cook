import * as React from "react";
import { createContext, useContext, useEffect } from "react";

import type {
  ThemeProviderProps,
  ThemeContextType,
} from "./ThemeProvider.types";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme, setTheme } = props;

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = (): void => {
        document.documentElement.setAttribute(
          "data-theme",
          mq.matches ? "dark" : "light",
        );
      };
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light",
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
