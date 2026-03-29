import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type * as Select from "@radix-ui/react-select";

export type DropdownSize = "sm" | "md" | "lg";

export type DropdownProps = ComponentPropsWithoutRef<typeof Select.Root>;

export type DropdownTriggerProps = ComponentPropsWithoutRef<typeof Select.Trigger> & {
  size?: DropdownSize;
  fullWidth?: boolean;
};

export type DropdownValueProps = ComponentPropsWithoutRef<typeof Select.Value> & {
  className?: string;
};

export type DropdownContentProps = ComponentPropsWithoutRef<typeof Select.Content> & {
  className?: string;
  viewportClassName?: string;
  showScrollButtons?: boolean;
};

export type DropdownGroupProps = ComponentPropsWithoutRef<typeof Select.Group>;

export type DropdownLabelProps = ComponentPropsWithoutRef<typeof Select.Label> & {
  className?: string;
};

export type DropdownItemProps = ComponentPropsWithoutRef<typeof Select.Item> & {
  startIcon?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export type DropdownSeparatorProps = ComponentPropsWithoutRef<typeof Select.Separator> & {
  className?: string;
};
