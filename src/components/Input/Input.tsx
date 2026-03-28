import { forwardRef } from "react";
import { clsx } from "clsx";

import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";
import { useFormFieldIds } from "../../hooks/useFormFieldIds";

const sizeStyles = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const variantStyles = {
  default: styles.variantDefault,
  ghost: styles.variantGhost,
};

/**
 * Input component for single-line text entry.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      label,
      description,
      error,
      size = "md",
      variant = "default",
      startIcon,
      endIcon,
      fullWidth = false,
      className,
      inputClassName,
      id,
      disabled,
      ...rest
    } = props;

    const { inputId, descriptionId, errorId, describedBy, hasSupporting } =
      useFormFieldIds(id, description, error, rest["aria-describedby"], "input");

    return (
      <div
        className={clsx(
          styles.field,
          variantStyles[variant],
          fullWidth && styles.fullWidth,
          className
        )}
      >
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div
          className={clsx(
            styles.control,
            sizeStyles[size],
            disabled && styles.disabled,
            error && styles.invalid
          )}
        >
          {startIcon && (
            <span className={styles.icon} aria-hidden="true">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            {...rest}
            id={inputId}
            className={clsx(styles.input, inputClassName)}
            disabled={disabled}
            aria-invalid={error ? true : rest["aria-invalid"]}
            aria-describedby={describedBy ? describedBy : undefined}
          />
          {endIcon && (
            <span className={styles.icon} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </div>
        {hasSupporting && (
          <div className={styles.supporting}>
            {description && (
              <p className={styles.description} id={descriptionId}>
                {description}
              </p>
            )}
            {error && (
              <p className={styles.error} id={errorId} role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
