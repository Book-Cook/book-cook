import * as React from "react";
import { SSRProvider } from "@fluentui/react-utilities";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { QueryClientProvider } from "@tanstack/react-query";

import { withMSW } from "./mswDecorator";
import { queryClient } from "../clients/react-query";
import { AppContainer } from "../components";
import { useTheme } from "../context";
import type { ThemePreference } from "../context/ThemeProvider";

const ThemeSync: React.FC<{
  preference: ThemePreference;
  children: React.ReactNode;
}> = ({ preference, children }) => {
  const { setThemePreference } = useTheme();
  React.useEffect(() => {
    setThemePreference(preference);
  }, [preference, setThemePreference]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export const withProviders = (
  Story: React.FC,
  context: { globals: { themeMode?: ThemePreference } }
) => {
  const preference: ThemePreference =
    (context.globals.themeMode as ThemePreference) || "light";
  return (
    <QueryClientProvider client={queryClient}>
      <RendererProvider renderer={createDOMRenderer()}>
        <SSRProvider>
          <AppContainer>
            <ThemeSync preference={preference}>
              <Story />
            </ThemeSync>
          </AppContainer>
        </SSRProvider>
      </RendererProvider>
    </QueryClientProvider>
  );
};

// Export MSW decorator for individual story use
export { withMSW };
