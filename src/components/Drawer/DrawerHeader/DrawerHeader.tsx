import * as React from "react";
import cx from "clsx";

import styles from "./DrawerHeader.module.css";
import type { DrawerHeaderProps } from "../Drawer/Drawer.types";

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.header, className)} {...rest}>
    {children}
  </div>
);
