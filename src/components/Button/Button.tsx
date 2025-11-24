import * as React from "react";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      appearance = "secondary",
      icon,
      children,
      className,
      type = "button",
      ...rest
    },
    ref
  ): React.ReactElement => {
    const buttonClassName = [styles.button, styles[appearance], className]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={buttonClassName} type={type} {...rest}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children && <span className={styles.content}>{children}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
