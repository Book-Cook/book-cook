import { XIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";

import styles from "./Dialog.module.css";
import type {
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./Dialog.types";

const sizeClassMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const variantClassMap = {
  default: null,
  search: styles.variantSearch,
} as const;

export const Dialog = (props: DialogProps) => (
  <DialogPrimitive.Root {...props} />
);

export const DialogTrigger = (props: DialogTriggerProps) => (
  <DialogPrimitive.Trigger {...props} />
);

export const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={clsx(styles.overlay, className)}
    {...props}
  />
);

export const DialogContent = ({
  className,
  overlayClassName,
  size = "md",
  variant = "default",
  motion = "default",
  withCloseButton = true,
  closeLabel = "Close dialog",
  withOverlay = true,
  children,
  ...props
}: DialogContentProps) => (
  <DialogPrimitive.Portal>
    {withOverlay && (
      <DialogOverlay className={overlayClassName} data-motion={motion} />
    )}
    <DialogPrimitive.Content
      className={clsx(
        styles.content,
        sizeClassMap[size],
        variantClassMap[variant],
        className,
      )}
      data-close-button={withCloseButton ? "" : undefined}
      data-motion={motion}
      {...props}
    >
      {children}
      {withCloseButton && (
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className={styles.closeButton}
          type="button"
        >
          <XIcon size={16} aria-hidden="true" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => (
  <DialogPrimitive.Title className={clsx(styles.title, className)} {...props} />
);

export const DialogDescription = ({
  className,
  ...props
}: DialogDescriptionProps) => (
  <DialogPrimitive.Description
    className={clsx(styles.description, className)}
    {...props}
  />
);

export const DialogClose = ({ className, ...props }: DialogCloseProps) => (
  <DialogPrimitive.Close className={clsx(styles.close, className)} {...props} />
);

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={clsx(styles.header, className)} {...props} />
);

export const DialogBody = ({ className, ...props }: DialogBodyProps) => (
  <div className={clsx(styles.body, className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div className={clsx(styles.footer, className)} {...props} />
);
