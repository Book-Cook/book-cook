import React from 'react';
import type { StoryContext } from '@storybook/react';
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

const StoryWrapper: React.FC<{ Story: React.ComponentType }> = ({ Story }) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");
  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
      <div style={{ padding: "12px 24px", boxSizing: "border-box" }}>
        <Story />
      </div>
    </SearchBoxProvider>
  );
};

export const withGlobalProviders = (Story: React.ComponentType, _context: StoryContext) => (
  <SessionProvider session={mockSession}>
    <StoryWrapper Story={Story} />
  </SessionProvider>
);
