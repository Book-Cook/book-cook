import type * as React from "react";

export type TextSize = 200 | 300 | 400 | 500 | 600 | 700 | 800;
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextVariant =
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2"
  | "heading3"
  | "heading2"
  | "heading1"
  | "caption";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: TextSize;
  weight?: TextWeight;
  italic?: boolean;
  block?: boolean;
  truncate?: boolean;
  variant?: TextVariant;
  children?: React.ReactNode;
  className?: string;
}
