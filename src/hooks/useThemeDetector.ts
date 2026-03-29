import * as React from "react";

export const useThemeDetector = () => {
  const darkThemeQuery =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  const [isDarkTheme, setIsDarkTheme] = React.useState(darkThemeQuery?.matches);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const themeListener = (ev: any) => {
    setIsDarkTheme(ev.matches);
  };

  React.useEffect(() => {
    darkThemeQuery?.addEventListener("change", themeListener);
    return () => darkThemeQuery?.removeEventListener("change", themeListener);
  }, [darkThemeQuery]);

  return isDarkTheme;
};
