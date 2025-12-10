import * as React from "react";
import clsx from "clsx";

import styles from "./DrawerHeader.module.css";
import type { DrawerHeaderProps } from "../Drawer/Drawer.types";

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  children,
  className,
  ...rest
}) => (
  <div className={clsx(styles.header, className)} {...rest}>
    {children}
  </div>
);
