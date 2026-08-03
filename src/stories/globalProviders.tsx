import React from "react";
import type { StoryContext } from "@storybook/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { SearchBoxProvider } from "../context";

const mockSession: Session = {
  user: {
    id: "user_123",
    email: "test@example.com",
    name: "Test User",
  },
  expires: "2099-12-31",
};

const StoryWrapper: React.FC<{ Story: React.ComponentType; theme: string }> = ({
  Story,
  theme,
}) => {
  // Design tokens are published on [data-theme], so stories must set it to
  // render with the same colours and typography as the application.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <SearchBoxProvider>
      <div style={{ padding: "12px 24px", boxSizing: "border-box" }}>
        <Story />
      </div>
    </SearchBoxProvider>
  );
};

export const withGlobalProviders = (
  Story: React.ComponentType,
  context: StoryContext,
) => (
  <SessionProvider session={mockSession}>
    <StoryWrapper
      Story={Story}
      theme={(context.globals.themeMode as string) ?? "light"}
    />
  </SessionProvider>
);
