import type { HTMLAttributes } from "react";
import type {
  DialogContentProps as RadixDialogContentProps,
  DialogDescriptionProps as RadixDialogDescriptionProps,
  DialogOverlayProps as RadixDialogOverlayProps,
  DialogProps as RadixDialogProps,
  DialogTitleProps as RadixDialogTitleProps,
  DialogTriggerProps as RadixDialogTriggerProps,
  DialogCloseProps as RadixDialogCloseProps,
} from "@radix-ui/react-dialog";

export type DialogProps = RadixDialogProps;
export type DialogTriggerProps = RadixDialogTriggerProps;
export type DialogOverlayProps = RadixDialogOverlayProps & {
  className?: string;
};

export type DialogSize = "sm" | "md" | "lg";
export type DialogVariant = "default" | "search";
export type DialogMotion = "default" | "none";

export type DialogContentProps = RadixDialogContentProps & {
  className?: string;
  overlayClassName?: string;
  size?: DialogSize;
  variant?: DialogVariant;
  withCloseButton?: boolean;
  closeLabel?: string;
  withOverlay?: boolean;
  motion?: DialogMotion;
};

export type DialogTitleProps = RadixDialogTitleProps & {
  className?: string;
};

export type DialogDescriptionProps = RadixDialogDescriptionProps & {
  className?: string;
};

export type DialogCloseProps = RadixDialogCloseProps & {
  className?: string;
};

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export type DialogBodyProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export type DialogFooterProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};
