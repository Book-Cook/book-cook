import type { ToasterProps } from "sonner";

export interface ToastProps extends Omit<ToasterProps, "toastOptions"> {
  /**
   * Override the base toast options.
   */
  toastOptions?: ToasterProps["toastOptions"];
}
