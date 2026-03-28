import { forwardRef } from "react";
import { clsx } from "clsx";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

const variantStyles = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
  destructive: styles.variantDestructive,
};

const sizeStyles = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const shapeStyles = {
  default: styles.shapeDefault,
  pill: styles.shapePill,
  square: styles.shapeSquare,
};

/**
 * Core Button component for Book Cook.
 * Supports "Notion-style" interactions and "Start Cooking" focus modes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      as: Component = "button",
      variant = "primary",
      size = "md",
      shape = "default",
      fullWidth = false,
      isLoading = false,
      startIcon,
      endIcon,
      className,
      children,
      disabled,
      ...rest
    } = props;

    const isDisabled = Boolean(disabled) || isLoading;

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          styles.button,
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          isLoading && styles.loading,
          className
        )}
        {...rest}
      >
        {/* Loading Spinner */}
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}

        {/* Content */}
        {!isLoading && startIcon}
        {!isLoading && <span>{children}</span>}
        {!isLoading && endIcon}
      </Component>
    );
  }
);

Button.displayName = "Button";
