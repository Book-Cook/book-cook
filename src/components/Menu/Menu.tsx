import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";

import styles from "./Menu.module.css";
import type {
  MenuContentProps,
  MenuGroupProps,
  MenuProps,
  MenuRadioGroupProps,
  MenuSubContentProps,
  MenuTriggerProps,
} from "./Menu.types";

export const Menu = (props: MenuProps) => <DropdownMenu.Root {...props} />;

export const MenuTrigger = (props: MenuTriggerProps) => (
  <DropdownMenu.Trigger {...props} />
);

export const MenuGroup = (props: MenuGroupProps) => (
  <DropdownMenu.Group {...props} />
);

export const MenuRadioGroup = (props: MenuRadioGroupProps) => (
  <DropdownMenu.RadioGroup {...props} />
);

export const MenuContent = ({
  className,
  sideOffset = 8,
  align = "start",
  ...props
}: MenuContentProps) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      className={clsx(styles.content, className)}
      sideOffset={sideOffset}
      align={align}
      {...props}
    />
  </DropdownMenu.Portal>
);

export const MenuSub = DropdownMenu.Sub;

export const MenuSubContent = ({
  className,
  sideOffset = 6,
  ...props
}: MenuSubContentProps) => (
  <DropdownMenu.Portal>
    <DropdownMenu.SubContent
      className={clsx(styles.content, className)}
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownMenu.Portal>
);
