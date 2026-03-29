import type { ReactNode } from "react";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "@radix-ui/react-dropdown-menu";

export type MenuProps = DropdownMenuProps;
export type MenuTriggerProps = DropdownMenuTriggerProps;
export type MenuGroupProps = DropdownMenuGroupProps;
export type MenuRadioGroupProps = DropdownMenuRadioGroupProps;

export type MenuContentProps = DropdownMenuContentProps & {
  className?: string;
};

export type MenuItemProps = DropdownMenuItemProps & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  shortcut?: string;
  inset?: boolean;
};

export type MenuCheckboxItemProps = DropdownMenuCheckboxItemProps & {
  shortcut?: string;
};

export type MenuRadioItemProps = DropdownMenuRadioItemProps & {
  shortcut?: string;
};

export type MenuLabelProps = DropdownMenuLabelProps & {
  inset?: boolean;
};

export type MenuSeparatorProps = DropdownMenuSeparatorProps;

export type MenuSubTriggerProps = DropdownMenuSubTriggerProps & {
  startIcon?: ReactNode;
  inset?: boolean;
};

export type MenuSubContentProps = DropdownMenuSubContentProps;
