import type { ReactNode } from "react";

import type { ButtonVariant } from "../Button/Button.types";

export interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;

  /** Called when the dialog requests to open or close. */
  onOpenChange: (open: boolean) => void;

  /** Short, action-oriented question, e.g. "Discard unsaved changes?". */
  title: string;

  /** Optional supporting copy explaining the consequence of confirming. */
  description?: ReactNode;

  /**
   * Label of the confirming action.
   * @default "Confirm"
   */
  confirmLabel?: string;

  /**
   * Label of the dismissing action.
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Visual hierarchy of the confirming action.
   * @default "destructive"
   */
  confirmVariant?: ButtonVariant;

  /**
   * Visual hierarchy of the dismissing action. Defaults to the bordered
   * secondary style so the safe choice reads as the stronger control next to a
   * destructive confirmation.
   * @default "secondary"
   */
  cancelVariant?: ButtonVariant;

  /** Called when the user confirms. */
  onConfirm: () => void;

  /** Called when the user dismisses, whether by button, overlay, or Escape. */
  onCancel?: () => void;
}
