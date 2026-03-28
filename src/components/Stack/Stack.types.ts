import type { ElementType, HTMLAttributes } from "react";

export type GapSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Direction = "row" | "column";
export type Alignment = "start" | "center" | "end" | "stretch" | "baseline";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /**
   * The HTML element or custom component to render as the stack container.
   */
  as?: ElementType;
  /**
   * The direction in which to stack the child elements.
   */
  direction?: Direction;
  /**
   * The gap size between child elements.
   */
  gap?: GapSize;
  /**
   * The alignment of child elements along the cross axis.
   */
  align?: Alignment;
  /**
   * Whether the stack should allow wrapping of child elements.
   */
  wrap?: boolean;
}
