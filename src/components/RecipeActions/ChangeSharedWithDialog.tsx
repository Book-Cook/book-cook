import * as React from "react";
import {
  makeStyles,
  Switch,
  tokens,
  Spinner,
} from "@fluentui/react-components";

import { ChangeDialog } from "./ChangeDialog";
import { Button } from "../Button";

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
  const styles = useStyles();
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
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : undefined}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <Switch
        checked={newIsPublic}
        onChange={() => {
          setNewIsPublic(!newIsPublic);
        }}
        label={
          newIsPublic
            ? "Public - Anyone can view this recipe"
            : "Private - Only you can view this recipe"
        }
        disabled={isLoading}
      />
    </ChangeDialog>
  );
};

export default ChangeSharedWithDialog;
