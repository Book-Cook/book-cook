import { clsx } from "clsx";
import { Toaster } from "sonner";
import type { ToasterProps, ToastClassnames } from "sonner";

import styles from "./Toast.module.css";
import type { ToastProps } from "./Toast.types";

const baseClassNames: ToastClassnames = {
  toast: styles.toast,
  title: styles.title,
  description: styles.description,
  actionButton: styles.actionButton,
  cancelButton: styles.cancelButton,
  closeButton: styles.closeButton,
  icon: styles.icon,
  content: styles.content,
  success: styles.typeSuccess,
  error: styles.typeError,
  warning: styles.typeWarning,
  info: styles.typeInfo,
  loading: styles.typeLoading,
  default: styles.typeDefault,
};

const baseToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
  unstyled: true,
  classNames: baseClassNames,
};

/**
 * Toast host configured for Book Cook styles.
 */
export const Toast = ({
  className,
  toastOptions,
  closeButton = true,
  ...props
}: ToastProps) => {
  const mergedToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
    ...baseToastOptions,
    ...toastOptions,
    classNames: {
      ...baseToastOptions.classNames,
      ...toastOptions?.classNames,
    },
  };

  return (
    <Toaster
      {...props}
      closeButton={closeButton}
      toastOptions={mergedToastOptions}
      className={clsx(styles.toaster, className)}
    />
  );
};
