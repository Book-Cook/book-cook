import type { ConfirmDialogProps } from "./ConfirmDialog.types";
import { Button } from "../Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Dialog";

/**
 * Confirmation prompt for destructive or irreversible actions.
 *
 * Composed from the shared Dialog primitives so it inherits the app's overlay,
 * focus trap, motion and escape handling rather than introducing new dialog
 * behaviour.
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  cancelVariant = "secondary",
  cancelPlacement = "start",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel?.();
    }
    onOpenChange(nextOpen);
  };

  const cancelButton = (
    <Button
      variant={cancelVariant}
      size="sm"
      onClick={() => handleOpenChange(false)}
    >
      {cancelLabel}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="sm" withCloseButton={false} role="alertdialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && (
          <DialogBody>
            <DialogDescription>{description}</DialogDescription>
          </DialogBody>
        )}
        <DialogFooter>
          {cancelPlacement === "start" && cancelButton}
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
          {cancelPlacement === "end" && cancelButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
