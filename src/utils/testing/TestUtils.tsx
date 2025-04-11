import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { render } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider/next-13.5";

import type { CustomRenderOptions } from "./TestUtils.types";

const customRender = (ui: React.ReactNode, options?: CustomRenderOptions) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MemoryRouterProvider>
        <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
      </MemoryRouterProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };
