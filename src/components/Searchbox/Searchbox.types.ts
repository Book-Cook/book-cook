import type { InputHTMLAttributes, ReactNode } from "react";

export type SearchboxSize = "sm" | "md" | "lg";
export type SearchboxVariant = "default" | "ghost";

export interface SearchboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "onSubmit"
  > {
  /**
   * Visible label rendered above the searchbox.
   */
  label?: string;

  /**
   * Supporting text rendered below the searchbox.
   */
  description?: string;

  /**
   * Error message displayed below the searchbox and announced to assistive tech.
   */
  error?: string;

  /**
   * Visual size of the searchbox.
   * @default "md"
   */
  size?: SearchboxSize;

  /**
   * Visual variant of the searchbox.
   * @default "default"
   */
  variant?: SearchboxVariant;

  /**
   * Whether the searchbox should take up the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Optional icon to render before the input text.
   */
  startIcon?: ReactNode;

  /**
   * Whether to show the leading search icon.
   * @default true
   */
  showStartIcon?: boolean;

  /**
   * Optional icon to render after the input text.
   */
  endIcon?: ReactNode;

  /**
   * Whether to show the clear button when there is input.
   * @default true
   */
  showClear?: boolean;

  /**
   * Label for the clear button.
   * @default "Clear search"
   */
  clearLabel?: string;

  /**
   * Callback fired when the clear button is pressed.
   */
  onClear?: () => void;

  /**
   * Callback fired with the current value when Enter is pressed.
   */
  onSubmit?: (value: string) => void;

  /**
   * Callback fired whenever the input value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Optional class name for the input element.
   */
  inputClassName?: string;

  /**
   * Optional class name for the control wrapper.
   */
  controlClassName?: string;

  /**
   * Controlled value for the searchbox.
   */
  value?: string;

  /**
   * Uncontrolled default value for the searchbox.
   */
  defaultValue?: string;
}
