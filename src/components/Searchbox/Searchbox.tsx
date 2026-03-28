import type {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  MouseEvent,
} from "react";
import { forwardRef, useRef, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import styles from "./Searchbox.module.css";
import type { SearchboxProps } from "./Searchbox.types";
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
 * Searchbox component for filtering content and running queries.
 */
export const Searchbox = forwardRef<HTMLInputElement, SearchboxProps>(
  (props, ref) => {
    const {
      label,
      description,
      error,
      size = "md",
      variant = "default",
      fullWidth = false,
      startIcon,
      endIcon,
      showStartIcon = true,
      showClear = true,
      clearLabel = "Clear search",
      onClear,
      onSubmit,
      onValueChange,
      inputClassName,
      controlClassName,
      className,
      id,
      value,
      defaultValue = "",
      disabled,
      onChange,
      onKeyDown,
      ...rest
    } = props;
    const { inputId, descriptionId, errorId, describedBy, hasSupporting } =
      useFormFieldIds(id, description, error, rest["aria-describedby"], "searchbox");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value ?? "" : internalValue;

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (!ref) {
        return;
      }
      if (typeof ref === "function") {
        ref(node);
        return;
      }
      (ref as MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onValueChange?.(event.target.value);
      onChange?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.nativeEvent.isComposing) {
        if (onSubmit) {
          event.preventDefault();
          onSubmit(event.currentTarget.value);
        }
      }
      onKeyDown?.(event);
    };

    const handleClear = () => {
      if (!isControlled && inputRef.current) {
        setInternalValue("");
      }
      onValueChange?.("");
      onClear?.();
      inputRef.current?.focus();
    };

    const showClearButton = showClear && !disabled && Boolean(currentValue);
    const handleControlMouseDown = (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      if (target.closest("button") || target.closest("input")) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };

    const resolvedStartIcon = showStartIcon
      ? startIcon ?? <MagnifyingGlassIcon size={16} />
      : null;

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
            error && styles.invalid,
            controlClassName
          )}
          role="search"
          onMouseDown={handleControlMouseDown}
        >
          {resolvedStartIcon && (
            <span className={styles.icon} aria-hidden="true">
              {resolvedStartIcon}
            </span>
          )}
          <input
            ref={setRefs}
            {...rest}
            id={inputId}
            className={clsx(styles.input, inputClassName)}
            disabled={disabled}
            aria-invalid={error ? true : rest["aria-invalid"]}
            aria-describedby={describedBy ? describedBy : undefined}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="search"
          />
          {endIcon && (
            <span className={styles.icon} aria-hidden="true">
              {endIcon}
            </span>
          )}
          {showClearButton && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label={clearLabel}
            >
              <XIcon size={14} aria-hidden="true" />
            </button>
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

Searchbox.displayName = "Searchbox";
