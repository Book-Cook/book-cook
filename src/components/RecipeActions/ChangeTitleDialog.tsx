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
import type { DialogOpenChangeEvent } from "@fluentui/react-components";

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
  textArea: {
    width: "100%",
    flexGrow: 1,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    minHeight: "80px",
    resize: "none",
  },
  dialogActions: {
    paddingTop: "0",

    ...shorthands.gap("12px"),
  },
  primaryButton: {
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  },
  secondaryButton: {
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-1px)",
    },
  },
  characterCount: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textAlign: "right",
    marginTop: "4px",
  },
});

export type ChangeTitleDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * The current title of the recipe.
   */
  currentTitle: string;
  /**
   * Callback function to handle saving the new title.
   */
  onSave: (newTitle: string) => void;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
  /**
   * Maximum allowed length for the title
   */
  maxLength?: number;
};

const ChangeTitleDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  currentTitle,
  onSave,
  onClose,
  maxLength = 100,
}) => {
  const styles = useStyles();
  const [newTitle, setNewTitle] = React.useState(currentTitle);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle);
      // Schedule focus and selection after the dialog renders
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(0, currentTitle.length);
        }
      }, 50);
    }
  }, [currentTitle, isOpen]);

  const handleSaveClick = () => {
    if (newTitle.trim()) {
      onSave(newTitle.trim());
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleOpenChange = (
    _event: DialogOpenChangeEvent,
    data: { open: boolean }
  ) => {
    if (!data.open) {
      onClose();
    }
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
      onOpenChange={handleOpenChange}
      modalType="modal"
      surfaceMotion={null}
    >
      <DialogSurface
        className={styles.dialogSurface}
        aria-describedby={undefined}
        onClick={(ev) => ev.stopPropagation()}
      >
        <DialogTitle className={styles.dialogTitle}>
          Change Recipe Title
        </DialogTitle>
        <DialogBody className={styles.dialogBody}>
          <Textarea
            placeholder="Enter recipe title"
            value={newTitle}
            onChange={(_e, data) =>
              setNewTitle(data.value.substring(0, maxLength))
            }
            className={styles.textArea}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            aria-label="Recipe title"
            resize="none"
          />
          <div className={styles.characterCount}>
            {newTitle.length}/{maxLength}
          </div>
        </DialogBody>
        <DialogActions className={styles.dialogActions}>
          <Button
            appearance="subtle"
            onClick={handleCancelClick}
            className={styles.secondaryButton}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSaveClick}
            className={styles.primaryButton}
            disabled={!newTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default ChangeTitleDialog;
