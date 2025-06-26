import React from 'react';
import { FluentProvider } from "@fluentui/react-components";
import { SSRProvider } from "@fluentui/react-utilities";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import type { StoryFn, StoryContext } from '@storybook/react';
import { QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { staticQueryClient } from "./staticDataProvider";
import { queryClient } from "../clients/react-query";
import { SearchBoxProvider, ThemeProvider, useTheme } from "../context";
import type { ThemePreference } from "../context/ThemeProvider";

// Default mock session for stories
export const mockSession: Session = {
  user: {
    id: "user_123",
    email: "test@example.com", 
    name: "Test User",
  },
  expires: "2024-12-31",
};

const ThemeSync: React.FC<{
  preference: ThemePreference;
  children: React.ReactNode;
}> = ({ preference, children }) => {
  const { setThemePreference } = useTheme();
  React.useEffect(() => {
    setThemePreference(preference);
  }, [preference, setThemePreference]);
  return children;
};

// Storybook-specific app content without toolbar
const StorybookAppContent: React.FC<{ 
  children?: React.ReactNode;
  preference: ThemePreference;
}> = ({ children, preference }) => {
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
        <ThemeSync preference={preference}>
          <div style={{ padding: "12px 24px", boxSizing: "border-box" }}>
            {children}
          </div>
        </ThemeSync>
      </SearchBoxProvider>
    </FluentProvider>
  );
};

// Minimal provider setup to isolate the issue
export const withFullProviders = (Story: StoryFn, context: StoryContext, options?: { session?: Session | null }) => {
  const session = options?.session ?? context.parameters?.session ?? mockSession;
  const preference: ThemePreference = (context.globals?.themeMode as ThemePreference) || "light";
  // Test with full provider stack including StorybookAppContent
  return (
    <RendererProvider renderer={createDOMRenderer()}>
      <SSRProvider>
        <QueryClientProvider client={staticQueryClient}>
          <SessionProvider session={session}>
            <ThemeProvider>
              <StorybookAppContent preference={preference}>
                <Story />
              </StorybookAppContent>
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </SSRProvider>
    </RendererProvider>
  );
};

// Provider decorator for unauthorized states (no session)
export const withFullProvidersNoAuth = (Story: StoryFn, context: StoryContext) => {
  return withFullProviders(Story, context, { session: null });
};

// Provider decorator for minimal setup (no SearchBoxProvider or AppContainer)
export const withMinimalProviders = (Story: StoryFn, options?: { session?: Session | null }) => {
  const session = options?.session ?? mockSession;
  
  return (
    <RendererProvider renderer={createDOMRenderer()}>
      <SSRProvider>
        <QueryClientProvider client={staticQueryClient}>
          <SessionProvider session={session}>
            <Story />
          </SessionProvider>
        </QueryClientProvider>
      </SSRProvider>
    </RendererProvider>
  );
};