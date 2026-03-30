import * as React from "react";

import { ChangeDialog } from "./ChangeDialog";
import styles from "./ChangeTitleDialog.module.css";
import { Button } from "../Button";

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
            appearance="secondary"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSaveClick}
            disabled={!newTitle.trim()}
          >
            Save
          </Button>
        </>
      }
    >
      <textarea
        placeholder="Enter recipe title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value.substring(0, maxLength))}
        className={styles.textArea}
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        aria-label="Recipe title"
      />
      <div className={styles.characterCount}>
        {newTitle.length}/{maxLength}
      </div>
    </ChangeDialog>
  );
};

export default ChangeTitleDialog;
