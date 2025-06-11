import * as React from "react";
import { Button, makeStyles, Switch, tokens } from "@fluentui/react-components";

import { ChangeDialog } from "./ChangeDialog";
import { FadeIn } from "../Animation";

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
};

const ChangeSharedWithDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  isPublic,
  onSave,
  onClose,
}) => {
  const styles = useStyles();
  const [newIsPublic, setNewIsPublic] = React.useState(isPublic);

  const handleSaveClick = () => {
    if (newIsPublic) {
      onSave(newIsPublic.toString());
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <ChangeDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Toggle Recipe Visibility"
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
          >
            Save
          </Button>
        </>
      }
    >
      <Switch
        checked={newIsPublic}
        onChange={() => {
          setNewIsPublic(!newIsPublic);
        }}
        label={"Set is public"}
      />
    </ChangeDialog>
  );
};

export default ChangeSharedWithDialog;
