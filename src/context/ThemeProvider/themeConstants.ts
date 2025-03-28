import type { ThemeMode, ThemePreference } from "./ThemeProvider.types";

// Local storage
export const LOCAL_STORAGE_PRIMARY_COLOR_KEY = "appPrimaryColor";
export const LOCAL_STORAGE_CACHED_THEME_KEY = "appCachedThemeObject";
export const LOCAL_STORAGE_THEME_PREFERENCE_KEY = "appThemePreference";

// Default values
export const DEFAULT_PRIMARY_COLOR = "#9e90e8";
export const DEFAULT_THEME_MODE: ThemeMode = "light";
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";
export const FALLBACK_BACKGROUND_COLOR = "#201f1f";
