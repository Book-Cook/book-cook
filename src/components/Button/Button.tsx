import * as React from "react";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

const ButtonComponent = ({
  appearance = "secondary",
  icon,
  children,
  ...rest
}: ButtonProps): React.ReactElement => {
  return (
    <button className={styles[appearance]} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.content}>{children}</span>}
    </button>
  );
};

export const Button = React.memo(ButtonComponent);
