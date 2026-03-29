import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "../Dialog";

export type ChangeDialogProps = {
  /**
   * Whether the dialog is open or not
   */
  isOpen: boolean;
  /**
   * Function to call when the dialog is closed
   */
  onClose: () => void;
  /**
   * Title of the dialog
   */
  title: string;

  /**
   * Actions to be displayed in the dialog
   */
  actions?: React.ReactNode;

  /**
   * Children to be displayed in the dialog
   */
  children: React.ReactNode;
};

export const ChangeDialog: React.FC<ChangeDialogProps> = (props) => {
  const { isOpen, onClose, title, actions } = props;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent size="sm" withCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{props.children}</DialogBody>
        {actions && <DialogFooter>{actions}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
