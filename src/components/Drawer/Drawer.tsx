import * as React from "react";

import styles from "./Drawer.module.css";
import type {
  DrawerBodyProps,
  DrawerHeaderProps,
  DrawerHeaderTitleProps,
  DrawerOnOpenChange,
  DrawerProps,
  DrawerSize,
} from "./Drawer.types";

type DrawerPopoverElement = HTMLDivElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
};

type PopoverAttributes = React.HTMLAttributes<HTMLDivElement> & {
  popover?: "manual" | "auto";
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const hasPopoverSupport =
  typeof HTMLElement !== "undefined" &&
  "showPopover" in HTMLElement.prototype &&
  "hidePopover" in HTMLElement.prototype;

const sizeClassMap: Record<DrawerSize, string> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
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

    const drawerRef = React.useRef<DrawerPopoverElement | null>(null);
    React.useImperativeHandle(forwardedRef, () => drawerRef.current);

    React.useEffect(() => {
      const node = drawerRef.current;
      if (!node || !hasPopoverSupport) {
        return;
      }

      if (open) {
        node.showPopover?.();
      } else {
        node.hidePopover?.();
      }
    }, [open]);

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
      if (open && drawerRef.current) {
        drawerRef.current.focus();
      }
    }, [open]);

    const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (
      event
    ) => {
      if (closeOnBackdropClick) {
        onOpenChange?.(event, { open: false });
      }

      backdropProps?.onClick?.(event);
    };

    const drawerClasses = [
      styles.drawer,
      styles[`position${capitalize(position)}`],
      sizeClassMap[size],
      open ? styles.open : styles.closed,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const backdropClasses = [
      styles.backdrop,
      open ? styles.backdropOpen : "",
      backdropProps?.className,
    ]
      .filter(Boolean)
      .join(" ");

    const popoverAttributes: PopoverAttributes = hasPopoverSupport
      ? { popover: "manual" }
      : {};

    const labelledBy = ariaLabelledBy || undefined;
    const accessibleLabel = ariaLabel || (labelledBy ? undefined : "Drawer");

    const { className: _unusedClassName, ...restProps } = rest;

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
          {...popoverAttributes}
          {...restProps}
        >
          {children}
        </div>
      </>
    );
  }
);

Drawer.displayName = "Drawer";

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  children,
  className,
  ...rest
}) => {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export const DrawerHeaderTitle: React.FC<DrawerHeaderTitleProps> = ({
  children,
  action,
  className,
  ...rest
}) => {
  const classes = [styles.headerTitle, className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      <span>{children}</span>
      {action ? <span className={styles.headerAction}>{action}</span> : null}
    </div>
  );
};

export const DrawerBody: React.FC<DrawerBodyProps> = ({
  children,
  className,
  ...rest
}) => {
  const classes = [styles.body, className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
