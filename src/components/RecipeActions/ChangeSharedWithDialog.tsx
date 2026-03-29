import * as React from "react";

import { ChangeDialog } from "./ChangeDialog";
import { Button } from "../Button";
import { Spinner } from "../Spinner";

export type ChangeTitleDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * Whether the recipe is public or not.
   */
  isPublic: boolean;
  /**
   * Callback function to handle saving the sharing status.
   */
  onSave: (newIsPublic: string) => void;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
  /**
   * Whether the save operation is in progress.
   */
  isLoading?: boolean;
};

const ChangeSharedWithDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  isPublic,
  onSave,
  onClose,
  isLoading = false,
}) => {
  const [newIsPublic, setNewIsPublic] = React.useState(isPublic);

  // Reset state when dialog opens or isPublic prop changes
  React.useEffect(() => {
    setNewIsPublic(isPublic);
  }, [isPublic, isOpen]);

  const handleSaveClick = () => {
    onSave(newIsPublic.toString());
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <ChangeDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isPublic ? "Make Recipe Private" : "Make Recipe Public"}
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
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : undefined}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
        <input
          type="checkbox"
          role="switch"
          aria-checked={newIsPublic}
          checked={newIsPublic}
          onChange={() => setNewIsPublic(!newIsPublic)}
          disabled={isLoading}
        />
        {newIsPublic
          ? "Public - Anyone can view this recipe"
          : "Private - Only you can view this recipe"}
      </label>
    </ChangeDialog>
  );
};

export default ChangeSharedWithDialog;
