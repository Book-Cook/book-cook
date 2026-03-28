import { forwardRef } from "react";
import { clsx } from "clsx";

import styles from "./Stack.module.css";
import type { StackProps } from "./Stack.types";

const directionStyles = {
  row: styles.directionRow,
  column: styles.directionColumn,
};

const alignStyles = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const gapStyles = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  "2xl": styles.gap2Xl,
};

/**
 * The stack component is a flexible layout container that arranges its children
 * in a horizontal or vertical stack with configurable spacing and alignment.
 */
export const Stack = forwardRef<HTMLElement, StackProps>((props, ref) => {
  const {
    as: Component = "div",
    direction = "column",
    gap = "md",
    align = "stretch",
    wrap = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <Component
      ref={ref}
      className={clsx(
        styles.stack,
        directionStyles[direction],
        alignStyles[align],
        gapStyles[gap],
        wrap ? styles.wrap : styles.noWrap,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

Stack.displayName = "Stack";
