import * as React from "react";
import { AppShell } from "./AppShell";
import { SearchBoxProvider } from "../context";
import { SessionProvider } from "next-auth/react";
import { Toast } from "./Toast";

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
