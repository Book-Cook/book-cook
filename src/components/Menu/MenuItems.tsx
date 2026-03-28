import { CaretRightIcon } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";

import styles from "./Menu.module.css";
import type {
  MenuCheckboxItemProps,
  MenuItemProps,
  MenuLabelProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuSubTriggerProps,
} from "./Menu.types";

const MenuItemIndicator = ({ markClassName }: { markClassName: string }) => (
  <span className={styles.indicatorSlot}>
    <DropdownMenu.ItemIndicator className={styles.indicator}>
      <span className={markClassName} aria-hidden="true" />
    </DropdownMenu.ItemIndicator>
  </span>
);

const MenuShortcutMeta = ({ shortcut }: { shortcut?: string }) =>
  shortcut ? (
    <span className={styles.itemMeta}>
      <span className={styles.shortcut}>{shortcut}</span>
    </span>
  ) : null;

export const MenuItem = ({
  className,
  startIcon,
  endIcon,
  shortcut,
  inset = false,
  children,
  ...props
}: MenuItemProps) => {
  const hasMeta = [shortcut, endIcon].some(Boolean);

  return (
    <DropdownMenu.Item
      className={clsx(styles.item, inset && styles.inset, className)}
      {...props}
    >
      {startIcon && <span className={styles.itemIcon}>{startIcon}</span>}
      <span className={styles.itemLabel}>{children}</span>
      {hasMeta && (
        <span className={styles.itemMeta}>
          {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
          {endIcon && <span className={styles.itemIcon}>{endIcon}</span>}
        </span>
      )}
    </DropdownMenu.Item>
  );
};

export const MenuCheckboxItem = ({
  className,
  shortcut,
  children,
  ...props
}: MenuCheckboxItemProps) => (
  <DropdownMenu.CheckboxItem
    className={clsx(styles.checkboxItem, className)}
    {...props}
  >
    <MenuItemIndicator markClassName={styles.checkmark} />
    <span className={styles.itemLabel}>{children}</span>
    <MenuShortcutMeta shortcut={shortcut} />
  </DropdownMenu.CheckboxItem>
);

export const MenuRadioItem = ({
  className,
  shortcut,
  children,
  ...props
}: MenuRadioItemProps) => (
  <DropdownMenu.RadioItem
    className={clsx(styles.radioItem, className)}
    {...props}
  >
    <MenuItemIndicator markClassName={styles.radiomark} />
    <span className={styles.itemLabel}>{children}</span>
    <MenuShortcutMeta shortcut={shortcut} />
  </DropdownMenu.RadioItem>
);

export const MenuLabel = ({
  className,
  inset = false,
  ...props
}: MenuLabelProps) => (
  <DropdownMenu.Label
    className={clsx(styles.label, inset && styles.inset, className)}
    {...props}
  />
);

export const MenuSeparator = ({
  className,
  ...props
}: MenuSeparatorProps) => (
  <DropdownMenu.Separator
    className={clsx(styles.separator, className)}
    {...props}
  />
);

export const MenuSubTrigger = ({
  className,
  startIcon,
  inset = false,
  children,
  ...props
}: MenuSubTriggerProps) => (
  <DropdownMenu.SubTrigger
    className={clsx(styles.subTrigger, inset && styles.inset, className)}
    {...props}
  >
    {startIcon && <span className={styles.itemIcon}>{startIcon}</span>}
    <span className={styles.itemLabel}>{children}</span>
    <CaretRightIcon size={16} className={styles.subCaret} aria-hidden="true" />
  </DropdownMenu.SubTrigger>
);
