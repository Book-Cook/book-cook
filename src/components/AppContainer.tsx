import * as React from "react";
import { FluentProvider } from "@fluentui/react-components";
import { Toolbar } from "./";
import { SearchBoxProvider } from "../context";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "../context";

const AppContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

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

  const [searchBoxValue, setSearchBoxValue] = React.useState("");
  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <FluentProvider theme={theme} style={fluentProviderStyles}>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <Toolbar />
        <div style={{ padding: "12px 24px", boxSizing: "border-box" }}>
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
