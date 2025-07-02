import React from 'react';
import { FluentProvider } from "@fluentui/react-components";
import { SSRProvider } from "@fluentui/react-utilities";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import type { StoryFn, StoryContext } from '@storybook/react';
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { SearchBoxProvider, ThemeProvider, useTheme } from "../context";

const mockSession: Session = {
  user: {
    id: "user_123",
    email: "test@example.com", 
    name: "Test User",
  },
  expires: "2024-12-31",
};

export const withGlobalProviders = (Story: StoryFn, context: StoryContext) => {
  const ThemeSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, setThemePreference } = useTheme();
    
    // Sync with Storybook theme toggle
    React.useEffect(() => {
      const storybookTheme = context.globals.themeMode;
      if (storybookTheme === 'dark') {
        setThemePreference('dark');
      } else {
        setThemePreference('light');
      }
    }, [setThemePreference]);
    
    const fluentProviderStyles = {
      height: "100%",
      backgroundColor: theme.colorNeutralBackground1,
      color: theme.colorNeutralForeground1,
      fontFamily: `"Nunito", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`,
      transition: "background-color 0.3s ease, color 0.3s ease",
    };

    const [searchBoxValue, setSearchBoxValue] = React.useState("");
    const onSearchBoxValueChange = (incomingValue: string) => {
      setSearchBoxValue(incomingValue);
    };

    return (
      <FluentProvider theme={theme} style={fluentProviderStyles}>
        <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
          <div style={{ padding: "12px 24px", boxSizing: "border-box" }}>
            {children}
          </div>
        </SearchBoxProvider>
      </FluentProvider>
    );
  };

  return (
    <RendererProvider renderer={createDOMRenderer()}>
      <SSRProvider>
        <SessionProvider session={mockSession}>
          <ThemeProvider>
            <ThemeSync>
              <Story />
            </ThemeSync>
          </ThemeProvider>
        </SessionProvider>
      </SSRProvider>
    </RendererProvider>
  );
};