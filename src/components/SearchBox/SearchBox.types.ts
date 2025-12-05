import type * as React from "react";

export interface SearchBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /**
   * Called when the input value changes.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  /**
   * Shows a clear button that resets the input to empty.
   */
  allowClear?: boolean;
  /**
   * Optional leading content (e.g., icon).
   */
  contentBefore?: React.ReactNode;
  /**
   * Optional trailing content.
   */
  contentAfter?: React.ReactNode;
}
