import * as React from "react";
import {
  FluentProvider,
  tokens,
  webLightTheme,
} from "@fluentui/react-components";
import { Toolbar } from "./";
import { SearchBoxProvider } from "../context";

const fluentProviderStyles = {
  height: "100%",
  backgroundColor: tokens.colorNeutralBackground2,
  fontFamily: `"Roboto", sans-serif`,
};

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");

  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <FluentProvider theme={webLightTheme} style={fluentProviderStyles}>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <Toolbar />
        {children}
      </SearchBoxProvider>
    </FluentProvider>
  );
};
