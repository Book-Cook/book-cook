import * as React from "react";
import { SessionProvider } from "next-auth/react";

import { AppShell } from "./AppShell";
import { Toast } from "./Toast";
import { SearchBoxProvider } from "../context/SearchBoxProvider";

// AppShell is imported statically: deferring it left the server emitting an
// empty <div id="__next">, so nothing painted until the JS had loaded.
// Toast is static too. Splitting it out saved no bytes -- every page loads it
// -- and cost three extra requests in a second waterfall after hydration.
export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
    <SearchBoxProvider>
      <Toast />
      <AppShell>{children}</AppShell>
    </SearchBoxProvider>
  </SessionProvider>
);
