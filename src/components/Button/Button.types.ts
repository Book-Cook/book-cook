import type * as React from "react";

export type ButtonAppearance =
  | "primary"
  | "subtle"
  | "secondary"
  | "transparent";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The appearance of the button
   */
  appearance?: ButtonAppearance;
  /**
   * Icon to display before the button text
   */
  icon?: React.ReactNode;
  /**
   * Children to render inside the button
   */
  children?: React.ReactNode;
  /**
   * Additional className to apply to the button
   */
  className?: string;
}
