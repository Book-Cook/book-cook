import * as React from "react";
import {
  createDynamicLightTheme,
  generateBrandVariants,
  createDynamicDarkTheme,
} from "../../components/theme/theme";
import type { Theme } from "@fluentui/react-components";
import type {
  ThemeMode,
  ThemeContextProps,
  InitialValues,
} from "./ThemeProvider.types";
import {
  DEFAULT_THEME_MODE,
  DEFAULT_PRIMARY_COLOR,
  LOCAL_STORAGE_PRIMARY_COLOR_KEY,
  LOCAL_STORAGE_THEME_MODE_KEY,
  LOCAL_STORAGE_CACHED_THEME_KEY,
} from "./themeConstants";

const ThemeContext = React.createContext<ThemeContextProps | undefined>(
  undefined
);

const getInitialValues = (): InitialValues => {
  let mode: ThemeMode = DEFAULT_THEME_MODE;
  let color: string = DEFAULT_PRIMARY_COLOR;
  let cachedThemeString: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const storedMode = localStorage.getItem(LOCAL_STORAGE_THEME_MODE_KEY);
      if (storedMode === "light" || storedMode === "dark") {
        mode = storedMode;
      }

      const storedColor = localStorage.getItem(LOCAL_STORAGE_PRIMARY_COLOR_KEY);
      if (storedColor) {
        color = storedColor;
      }

      cachedThemeString = localStorage.getItem(LOCAL_STORAGE_CACHED_THEME_KEY);
    } catch (error) {
      console.error(
        "Failed to read initial theme values from localStorage:",
        error
      );
      cachedThemeString = null; // Don't use cache if read failed
    }
  }
  return { mode, color, cachedThemeString };
};

const persistThemeData = (theme: Theme, mode: ThemeMode) => {
  if (typeof window !== "undefined") {
    try {
      const primaryColor = theme.colorBrandBackground || DEFAULT_PRIMARY_COLOR;
      localStorage.setItem(
        LOCAL_STORAGE_CACHED_THEME_KEY,
        JSON.stringify(theme)
      );
      localStorage.setItem(LOCAL_STORAGE_THEME_MODE_KEY, mode);
      localStorage.setItem(LOCAL_STORAGE_PRIMARY_COLOR_KEY, primaryColor);
    } catch (error) {
      console.error(`Failed to write theme data to localStorage:`, error);
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialValues] = React.useState(getInitialValues);

  const [themeMode, setThemeMode] = React.useState<ThemeMode>(
    initialValues.mode
  );
  const [primaryColor, setPrimaryColorState] = React.useState<string>(
    initialValues.color
  );

  // Attempt to parse the initial cached theme string once on mount
  const [initialCachedTheme] = React.useState<Theme | undefined>(() => {
    if (initialValues.cachedThemeString) {
      try {
        return JSON.parse(initialValues.cachedThemeString);
      } catch (error) {
        console.error("Failed to parse cached theme from localStorage:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem(LOCAL_STORAGE_CACHED_THEME_KEY); // Clear corrupted cache
        }
        return undefined;
      }
    }
    return undefined;
  });

  const theme = React.useMemo((): Theme => {
    const canUseInitialCache =
      initialCachedTheme &&
      themeMode === initialValues.mode &&
      primaryColor === initialValues.color &&
      initialCachedTheme.colorBrandBackground === primaryColor; // Integrity check

    if (canUseInitialCache) {
      return initialCachedTheme;
    }

    // Regenerate if cache invalid, missing, or mode/color state has changed
    const currentBrandVariants = generateBrandVariants(primaryColor);
    return themeMode === "light"
      ? createDynamicLightTheme(currentBrandVariants)
      : createDynamicDarkTheme(currentBrandVariants);
  }, [
    themeMode,
    primaryColor,
    initialCachedTheme,
    initialValues.mode,
    initialValues.color,
  ]);

  const toggleTheme = React.useCallback(() => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const setPrimaryColor = React.useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  const contextValue = React.useMemo(
    () => ({ theme, themeMode, primaryColor, toggleTheme, setPrimaryColor }),
    [theme, themeMode, primaryColor, toggleTheme, setPrimaryColor]
  );

  React.useEffect(() => {
    persistThemeData(theme, themeMode);

    // Apply side effects
    if (theme.colorNeutralBackground1) {
      document.body.style.backgroundColor = theme.colorNeutralBackground1;
      const themeMetaTag = document.querySelector('meta[name="theme-color"]');
      if (themeMetaTag) {
        themeMetaTag.setAttribute("content", theme.colorNeutralBackground1);
      }
    }
  }, [theme, themeMode]); // Persist and apply changes when theme or mode updates

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Hook must be used within the provider
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
