import * as React from "react";
import { FluentProvider } from "@fluentui/react-components";
import clsx from "clsx";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

import styles from "./AppContainer.module.css";
import { SearchBoxProvider, ThemeProvider, useTheme } from "../context";

import { Toolbar } from ".";

const AppContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const router = useRouter();

  // Full-width pages that shouldn't have padding
  const isFullWidthPage = router.pathname === "/meal-plan";

  const [searchBoxValue, setSearchBoxValue] = React.useState("");
  const onSearchBoxValueChange = React.useCallback((incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  }, []);

  const searchBoxContextValue = React.useMemo(
    () => ({ searchBoxValue, onSearchBoxValueChange }),
    [searchBoxValue, onSearchBoxValueChange]
  );

  const contentClassName = clsx(
    styles.content,
    isFullWidthPage && styles.fullWidth
  );

  const fluentProviderStyle = React.useMemo(
    () =>
      ({
        "--app-bg": theme.colorNeutralBackground1,
        "--app-fg": theme.colorNeutralForeground1,
        "--app-font": `"Nunito", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`,
      }) as React.CSSProperties,
    [theme.colorNeutralBackground1, theme.colorNeutralForeground1]
  );

  return (
    <FluentProvider
      theme={theme}
      style={fluentProviderStyle}
      className={styles.root}
    >
      <SearchBoxProvider value={searchBoxContextValue}>
        <Toolbar />
        <div className={contentClassName}>{children}</div>
      </SearchBoxProvider>
    </FluentProvider>
  );
};

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AppContent>{children}</AppContent>
      </ThemeProvider>
    </SessionProvider>
  );
};
