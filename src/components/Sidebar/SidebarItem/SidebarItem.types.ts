import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface SidebarItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
  depth?: number;
  endAdornment?: ReactNode;
  iconOnly?: boolean;
  labelStacked?: boolean;
}
