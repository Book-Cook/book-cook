import type { ReactElement, ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export type TooltipProps = {
  /**
   * Tooltip content.
   */
  content?: ReactNode;
  /**
   * Trigger element for the tooltip.
   */
  children: ReactElement;
  /**
   * Side where the tooltip appears.
   * @default "top"
   */
  side?: TooltipSide;
  /**
   * Alignment of the tooltip relative to the trigger.
   * @default "center"
   */
  align?: TooltipAlign;
  /**
   * Delay in milliseconds before showing.
   * @default 200
   */
  delay?: number;
  /**
   * Distance in pixels between the trigger and tooltip.
   * @default 8
   */
  offset?: number;
  /**
   * Whether the tooltip is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Show the tooltip arrow.
   * @default true
   */
  withArrow?: boolean;
  /**
   * Optional class names for the tooltip content.
   */
  className?: string;
};
