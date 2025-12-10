import * as React from "react";

import styles from "./Spinner.module.css";
import type { SpinnerProps } from "./Spinner.types";

const DEFAULT_LABEL = "Loading";

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { size = "medium", label, ariaLabel = DEFAULT_LABEL, className, ...rest },
    ref
  ) => {
    const mergedClassName = [styles.spinner, styles[size], className]
      .filter(Boolean)
      .join(" ");

    const accessibleLabel =
      typeof label === "string" && label.trim().length > 0
        ? label
        : ariaLabel || DEFAULT_LABEL;

    return (
      <div
        ref={ref}
        className={mergedClassName}
        role="progressbar"
        aria-live="polite"
        aria-label={accessibleLabel}
        {...rest}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {label ? <span className={styles.label}>{label}</span> : null}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
