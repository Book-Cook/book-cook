import {
  LOCAL_STORAGE_CACHED_THEME_KEY,
  FALLBACK_BACKGROUND_COLOR,
} from "./themeConstants";

export const blockingThemeScript = `
(function() {
  try {
    const THEME_KEY = '${LOCAL_STORAGE_CACHED_THEME_KEY}';
    const BG_PROP = 'colorNeutralBackground1';
    const DEFAULT_BG = '${FALLBACK_BACKGROUND_COLOR}';
    const themeMetaTag = document.querySelector('meta[name="theme-color"]');
    let bgColor = DEFAULT_BG;

    const storedThemeString = localStorage.getItem(THEME_KEY);
    if (storedThemeString) {
      const parsedTheme = JSON.parse(storedThemeString);
      if (parsedTheme && typeof parsedTheme === 'object' && parsedTheme[BG_PROP]) {
        bgColor = parsedTheme[BG_PROP];
      }
    }

    document.documentElement.style.setProperty('--initial-body-bg', bgColor);
    document.body.style.backgroundColor = bgColor;

    if (themeMetaTag) {
      themeMetaTag.setAttribute('content', bgColor);
    }
  } catch (e) {}
})();
`;
