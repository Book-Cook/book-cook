import * as React from "react";
import { clsx } from "clsx";

import styles from "./DrawerBody.module.css";
import type { DrawerBodyProps } from "../Drawer/Drawer.types";

export const DrawerBody: React.FC<DrawerBodyProps> = ({
  children,
  className,
  ...rest
}) => (
  <div className={clsx(styles.body, className)} {...rest}>
    {children}
  </div>
);
