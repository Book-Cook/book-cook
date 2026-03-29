import * as React from "react";
import {
  Textarea,
  Button,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

import { ChangeDialog } from "./ChangeDialog";

const useStyles = makeStyles({
  textArea: {
    width: "100%",
    flexGrow: 1,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    minHeight: "80px",
    resize: "none",
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
    ":hover": { transform: "translateY(-1px)" },
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

const maxLength = 100;

const ChangeTitleDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  currentTitle,
  onSave,
  onClose,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <ChangeDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Change Recipe Title"
      actions={
        <>
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
        </>
      }
    >
      <Textarea
        placeholder="Enter recipe title"
        value={newTitle}
        onChange={(_e, data) => setNewTitle(data.value.substring(0, maxLength))}
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
    </ChangeDialog>
  );
};

export default ChangeTitleDialog;
