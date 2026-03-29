import * as React from "react";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

import { Toast } from "./Toast";
import { SearchBoxProvider } from "../context";

const AppShell = dynamic(
  () => import("./AppShell").then((m) => ({ default: m.AppShell })),
  { ssr: false, loading: () => null }
);

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");

  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <SessionProvider>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <Toast />
        <AppShell>{children}</AppShell>
      </SearchBoxProvider>
    </SessionProvider>
  );
};
