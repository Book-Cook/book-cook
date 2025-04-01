import * as React from "react";
import { useWindow } from "@fluentui/react-window-provider";

export const useThemeDetector = () => {
  const currentWindow = useWindow();

  const darkThemeQuery = currentWindow?.matchMedia(
    "(prefers-color-scheme: dark)"
  );

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
