import type * as React from "react";

export type LinkUnderline = "hover" | "always" | "none";
export type LinkTone = "default" | "muted";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  underline?: LinkUnderline;
  tone?: LinkTone;
  children?: React.ReactNode;
  className?: string;
}
