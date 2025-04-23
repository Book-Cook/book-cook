import * as React from "react";
import {
  Textarea,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: "450px",
    width: "100%",
    ...shorthands.borderRadius("14px"),
    boxShadow: tokens.shadow16,
  },
  dialogTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "4px",
  },
  dialogBody: {
    paddingTop: "12px",
    paddingBottom: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export type ChangeTitleDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * The current shared with users of the recipe.
   */
  sharedWith: string[];
  /**
   * Callback function to handle saving the new title.
   */
  onSave: (newSharedWithUsers: string[]) => void;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
};

const ChangeSharedWithDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  sharedWith,
  onClose,
  onSave,
}) => {
  const styles = useStyles();
  const [sharedWithUsers, setSharedWithUsers] = React.useState(sharedWith);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSaveClick = () => {
    onSave(sharedWithUsers);
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(ev, data) => {
        ev.stopPropagation();
        return !data.open && onClose();
      }}
      modalType="modal"
      surfaceMotion={null}
    >
      <DialogSurface
        className={styles.dialogSurface}
        aria-describedby={undefined}
        onClick={(ev) => ev.stopPropagation()}
      >
        {JSON.stringify(sharedWithUsers)}
      </DialogSurface>
    </Dialog>
  );
};

export default ChangeSharedWithDialog;
