import * as React from "react";
import {
  FluentProvider,
  tokens,
  webLightTheme,
} from "@fluentui/react-components";

const fluentProviderStyles = {
  height: "100%",
  backgroundColor: tokens.colorNeutralBackground2,
  fontFamily: `"Roboto", sans-serif`,
};

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  // const [theme, setTheme] = React.useState(webLightTheme);

  return (
    <FluentProvider theme={webLightTheme} style={fluentProviderStyles}>
      {children}
    </FluentProvider>
  );
};
