import * as React from "react";
import { createContext, useContext, useEffect } from "react";

import styles from "./theme.module.css";
import type {
  ThemeProviderProps,
  ThemeContextType,
} from "./ThemeProvider.types";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme, setTheme } = props;

  useEffect(() => {
    const newClassName = theme === "dark" ? styles.dark : styles.light;
    document.documentElement.className = newClassName;
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
