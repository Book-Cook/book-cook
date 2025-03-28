import type { ThemeMode } from "./ThemeProvider.types";

// Local storage
export const LOCAL_STORAGE_THEME_MODE_KEY = "appThemeMode";
export const LOCAL_STORAGE_PRIMARY_COLOR_KEY = "appPrimaryColor";
export const LOCAL_STORAGE_CACHED_THEME_KEY = "appCachedThemeObject";

// Default values
export const DEFAULT_PRIMARY_COLOR = "#9e90e8";
export const DEFAULT_THEME_MODE: ThemeMode = "light";
export const FALLBACK_BACKGROUND_COLOR = "#201f1f";
