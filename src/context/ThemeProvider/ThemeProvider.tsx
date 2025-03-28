import * as React from "react";
import {
  createDynamicLightTheme,
  generateBrandVariants,
  createDynamicDarkTheme,
} from "../../components/theme/theme";
import type { Theme } from "@fluentui/react-components";
import type {
  ThemeMode,
  ThemePreference,
  ThemeContextProps,
  InitialValues,
} from "./ThemeProvider.types";
import {
  DEFAULT_THEME_PREFERENCE,
  DEFAULT_PRIMARY_COLOR,
  LOCAL_STORAGE_PRIMARY_COLOR_KEY,
  LOCAL_STORAGE_THEME_PREFERENCE_KEY,
  LOCAL_STORAGE_CACHED_THEME_KEY,
} from "./themeConstants";
import { useThemeDetector } from "../../hooks";

const ThemeContext = React.createContext<ThemeContextProps | undefined>(
  undefined
);

const getInitialValues = (): InitialValues => {
  let preference: ThemePreference = DEFAULT_THEME_PREFERENCE;
  let color: string = DEFAULT_PRIMARY_COLOR;
  let cachedThemeString: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const storedPreference = localStorage.getItem(
        LOCAL_STORAGE_THEME_PREFERENCE_KEY
      );
      if (
        storedPreference === "light" ||
        storedPreference === "dark" ||
        storedPreference === "system"
      ) {
        preference = storedPreference;
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
      cachedThemeString = null;
    }
  }
  return { preference, color, cachedThemeString };
};

const persistThemeData = (theme: Theme, preference: ThemePreference) => {
  if (typeof window !== "undefined") {
    try {
      const primaryColor = theme.colorBrandBackground || DEFAULT_PRIMARY_COLOR;
      localStorage.setItem(
        LOCAL_STORAGE_CACHED_THEME_KEY,
        JSON.stringify(theme)
      );
      localStorage.setItem(LOCAL_STORAGE_THEME_PREFERENCE_KEY, preference);
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
  const isSystemDark = useThemeDetector();

  const [themePreference, setThemePreferenceState] =
    React.useState<ThemePreference>(initialValues.preference);
  const [primaryColor, setPrimaryColorState] = React.useState<string>(
    initialValues.color
  );

  const appliedThemeMode = React.useMemo((): ThemeMode => {
    const systemMode = isSystemDark ? "dark" : "light";
    return themePreference === "system" ? systemMode : themePreference;
  }, [themePreference, isSystemDark]);

  const [initialCachedTheme] = React.useState<Theme | undefined>(() => {
    if (initialValues.cachedThemeString) {
      try {
        const parsed = JSON.parse(initialValues.cachedThemeString);
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.colorBrandBackground
        ) {
          return parsed;
        }
        throw new Error("Parsed data is not a valid theme object");
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
    const stateMatchesInitialValues =
      themePreference === initialValues.preference &&
      primaryColor === initialValues.color;

    const canUseInitialCache =
      initialCachedTheme &&
      stateMatchesInitialValues &&
      initialCachedTheme.colorBrandBackground === primaryColor;

    if (canUseInitialCache) {
      return initialCachedTheme;
    }

    const currentBrandVariants = generateBrandVariants(primaryColor);
    return appliedThemeMode === "light"
      ? createDynamicLightTheme(currentBrandVariants)
      : createDynamicDarkTheme(currentBrandVariants);
  }, [
    appliedThemeMode,
    primaryColor,
    initialCachedTheme,
    themePreference,
    initialValues.preference,
    initialValues.color,
  ]);

  const setThemePreference = React.useCallback(
    (preference: ThemePreference) => {
      setThemePreferenceState(preference);
    },
    []
  );

  const setPrimaryColor = React.useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      theme,
      appliedThemeMode,
      themePreference,
      setThemePreference,
      primaryColor,
      setPrimaryColor,
    }),
    [
      theme,
      appliedThemeMode,
      themePreference,
      setThemePreference,
      primaryColor,
      setPrimaryColor,
    ]
  );

  React.useEffect(() => {
    persistThemeData(theme, themePreference);

    if (theme.colorNeutralBackground1) {
      document.body.style.backgroundColor = theme.colorNeutralBackground1;
      const themeMetaTag = document.querySelector('meta[name="theme-color"]');
      if (themeMetaTag) {
        themeMetaTag.setAttribute("content", theme.colorNeutralBackground1);
      }
    }
  }, [theme, themePreference]); // Persist when theme object or user preference changes

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
