import * as React from "react";
import clsx from "clsx";

import styles from "./DrawerHeaderTitle.module.css";
import type { DrawerHeaderTitleProps } from "../Drawer/Drawer.types";

import { Text } from "../../Text";

export const DrawerHeaderTitle: React.FC<DrawerHeaderTitleProps> = ({
  children,
  action,
  className,
  ...rest
}) => (
  <div className={clsx(styles.headerTitle, className)} {...rest}>
    <Text variant="heading3" as="span">
      {children}
    </Text>
    {action ? <span className={styles.headerAction}>{action}</span> : null}
  </div>
);
