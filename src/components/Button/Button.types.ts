import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonShape = "default" | "pill" | "square";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual hierarchy of the button.
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * FluentUI-compatible appearance alias — maps to variant.
   */
  appearance?: "primary" | "secondary" | "outline" | "subtle" | "transparent";

  /**
   * Size of the button affecting padding and font size.
   * @default "md"
   */
  size?: ButtonSize;

  /**
   * Shape of the button. Use 'pill' for Action Chips.
   * @default "default"
   */
  shape?: ButtonShape;

  /**
   * Whether the button takes up the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Shows a loading state and disables interaction.
   */
  isLoading?: boolean;

  /**
   * Icon element to display before the text.
   */
  startIcon?: ReactNode;

  /**
   * Icon element to display after the text.
   */
  endIcon?: ReactNode;

  /**
   * Polymorphic prop to render as a different element (e.g., 'a' tag).
   */
  as?: ElementType;
}
