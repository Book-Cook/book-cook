import * as React from "react";
import { SessionProvider } from "next-auth/react";

import { AppShell } from "./AppShell";
import { Toast } from "./Toast";
import { SearchBoxProvider } from "../context";

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
