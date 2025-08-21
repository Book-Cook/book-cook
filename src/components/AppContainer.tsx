import * as React from "react";
import { FluentProvider } from "@fluentui/react-components";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

import { SearchBoxProvider, ThemeProvider, useTheme } from "../context";

import { Toolbar } from ".";

const AppContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const fluentProviderStyles = React.useMemo(
    () => ({
      height: "100%",
      backgroundColor: theme.colorNeutralBackground1,
      color: theme.colorNeutralForeground1,
      fontFamily: `"Nunito", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`,
      transition: "background-color 0.3s ease, color 0.3s ease",
    }),
    [theme]
  );

  // Full-width pages that shouldn't have padding
  const isFullWidthPage = router.pathname === "/meal-plan";

  const [searchBoxValue, setSearchBoxValue] = React.useState("");
  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <FluentProvider theme={theme} style={fluentProviderStyles}>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <Toolbar />
        <div style={{ 
          padding: isFullWidthPage ? "0" : "12px 24px", 
          boxSizing: "border-box" 
        }}>
          {children}
        </div>
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
