import type { HTMLAttributes, ReactNode } from "react";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseBreakpoint?: number;
  width?: number | string;
  collapsedWidth?: number | string;
  profile?: SidebarProfile;
  showToggle?: boolean;
}

export type SidebarProfile = {
  name: string;
  onClick?: () => void;
  ariaLabel?: string;
  imageURL?: string;
  meta?: string;
};
