import type * as React from "react";

export type SpinnerSize = "tiny" | "small" | "medium" | "large";

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "aria-label"> {
  /**
   * Visible or screen reader label. Falls back to "Loading" when omitted.
   */
  ariaLabel?: string;
  /**
   * Optional text rendered next to the spinner.
   */
  label?: React.ReactNode;
  /**
   * Controls the diameter and stroke width of the indicator.
   */
  size?: SpinnerSize;
}
