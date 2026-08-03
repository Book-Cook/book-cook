import * as React from "react";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

import { AppShell } from "./AppShell";
import { SearchBoxProvider } from "../context/SearchBoxProvider";

// Toast renders into a portal and shows nothing until a toast fires, so it is
// the one piece of the shell with no first-paint value and is safely deferred.
// AppShell is imported statically: deferring it left the server emitting an
// empty <div id="__next">, so nothing painted until the JS had loaded.
const Toast = dynamic(
  () => import("./Toast").then((m) => ({ default: m.Toast })),
  { ssr: false, loading: () => null },
);

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
