import * as React from "react";
import clsx from "clsx";

import styles from "./Drawer.module.css";
import type { DrawerPosition, DrawerProps, DrawerSize } from "./Drawer.types";

const sizeClassMap: Record<DrawerSize, string> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
};

const positionClassMap: Record<DrawerPosition, string> = {
  start: styles.positionStart,
  end: styles.positionEnd,
  top: styles.positionTop,
  bottom: styles.positionBottom,
};

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (props, forwardedRef): React.ReactElement => {
    const {
      open,
      onOpenChange,
      position = "end",
      size = "medium",
      closeOnEscape = true,
      closeOnBackdropClick = true,
      ariaLabel,
      ariaLabelledBy,
      backdropProps,
      className,
      children,
      ...rest
    } = props;

    const drawerRef = React.useRef<HTMLDivElement>(null!);
    React.useImperativeHandle(forwardedRef, () => drawerRef.current);

    React.useEffect(() => {
      if (!open || !closeOnEscape) {
        return;
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onOpenChange?.(event, { open: false });
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeOnEscape, onOpenChange, open]);

    React.useEffect(() => {
      if (!open) {
        return;
      }
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, [open]);

    React.useEffect(() => {
      if (open) {
        drawerRef.current?.focus();
      }
    }, [open]);

    const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> =
      React.useCallback(
        (event) => {
          if (closeOnBackdropClick) {
            onOpenChange?.(event, { open: false });
          }
          backdropProps?.onClick?.(event);
        },
        [backdropProps, closeOnBackdropClick, onOpenChange]
      );

    const drawerClasses = clsx(
      styles.drawer,
      positionClassMap[position],
      sizeClassMap[size],
      open ? styles.open : styles.closed,
      className
    );

    const backdropClasses = clsx(
      styles.backdrop,
      open && styles.backdropOpen,
      backdropProps?.className
    );

    const labelledBy = ariaLabelledBy ?? undefined;
    const accessibleLabel = ariaLabel ?? (labelledBy ? undefined : "Drawer");

    return (
      <>
        <div
          aria-hidden
          {...backdropProps}
          className={backdropClasses}
          data-state={open ? "open" : "closed"}
          onClick={handleBackdropClick}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          aria-label={accessibleLabel}
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={drawerClasses}
          data-position={position}
          data-state={open ? "open" : "closed"}
          {...rest}
        >
          {children}
        </div>
      </>
    );
  }
);

Drawer.displayName = "Drawer";
