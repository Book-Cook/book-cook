import type { InputHTMLAttributes, ReactNode } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "ghost";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Visible label rendered above the input.
   */
  label?: string;

  /**
   * Supporting text rendered below the input.
   */
  description?: string;

  /**
   * Error message displayed below the input and announced to assistive tech.
   */
  error?: string;

  /**
   * Visual size of the input.
   * @default "md"
   */
  size?: InputSize;

  /**
   * Visual variant of the input.
   * @default "default"
   */
  variant?: InputVariant;

  /**
   * Optional icon to render before the input text.
   */
  startIcon?: ReactNode;

  /**
   * Optional icon to render after the input text.
   */
  endIcon?: ReactNode;

  /**
   * Whether the input should take up the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Optional class name for the input element.
   */
  inputClassName?: string;
}
