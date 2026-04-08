import { forwardRef } from "react";
import { clsx } from "clsx";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

const variantStyles = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.subtle,
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
      appearance = "secondary",
      variant,
      size = "md",
      shape = "default",
      fullWidth = false,
      isLoading = false,
      icon,
      startIcon: startIconProp,
      endIcon,
      className,
      children,
      disabled,
      type,
      ...rest
    } = props;

    const startIcon = icon ?? startIconProp;
    const isDisabled = Boolean(disabled) || isLoading;
    const resolvedType =
      type ?? (Component === "button" ? "button" : undefined);

    return (
      <Component
        ref={ref}
        type={resolvedType}
        disabled={isDisabled}
        className={clsx(
          styles.button,
          styles[appearance],
          variant && variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          isLoading && styles.loading,
          className,
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
  },
);

Button.displayName = "Button";
