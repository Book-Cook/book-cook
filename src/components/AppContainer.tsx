import * as React from "react";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

import { SearchBoxProvider } from "../context/SearchBoxProvider";

const Toast = dynamic(
  () => import("./Toast").then((m) => ({ default: m.Toast })),
  { ssr: false, loading: () => null },
);

const AppShell = dynamic(
  () => import("./AppShell").then((m) => ({ default: m.AppShell })),
  { ssr: false, loading: () => null },
);

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");

  const onSearchBoxValueChange = React.useCallback((incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  }, []);

  const searchBoxContextValue = React.useMemo(
    () => ({ searchBoxValue, onSearchBoxValueChange }),
    [searchBoxValue, onSearchBoxValueChange],
  );

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <SearchBoxProvider value={searchBoxContextValue}>
        <Toast />
        <AppShell>{children}</AppShell>
      </SearchBoxProvider>
    </SessionProvider>
  );
};
