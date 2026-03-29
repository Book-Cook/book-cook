import type { RenderOptions } from "@testing-library/react";

export type ProviderProps = {
  /**
   * Child to be rendered inside the provider
   */
  children: React.ReactNode;
};

export type CustomRenderOptions = Omit<RenderOptions, "wrapper">;
