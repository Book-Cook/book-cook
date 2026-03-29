import type { ElementType, HTMLAttributes } from "react";

type TextVariant =
  | "recipeTitle"
  | "pageTitle"
  | "sectionHeading"
  | "subsectionHeading"
  | "focusStep"
  | "bodyText"
  | "metaLabel";

export interface TypographyProps<T extends ElementType = ElementType>
  extends HTMLAttributes<HTMLElement> {
  /**
   * The HTML element or React component to render as the Typography component
   */
  as?: T;
}

export interface TextProps extends TypographyProps {
  /**
   * The variant style to apply to the Typography component
   */
  variant?: TextVariant;

  /**
   * Whether the text should be bold.
   */
  bold?: boolean;

  /**
   * Whether the text should be italic.
   */
  italic?: boolean;

  /**
   * Whether the text should be underlined.
   */
  underline?: boolean;

  /**
   * Whether the text should have a strikethrough.
   */
  strikethrough?: boolean;
}
