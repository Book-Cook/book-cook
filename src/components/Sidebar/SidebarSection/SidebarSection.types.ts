import type { HTMLAttributes, ReactNode } from "react";

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string;
  depth?: number;
  variant?: "section" | "item";
  icon?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
