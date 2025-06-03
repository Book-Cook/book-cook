import * as React from "react";
import {
  Button,
  makeStyles,
  shorthands,
  tokens,
  Input,
  Text,
} from "@fluentui/react-components";
import {
  PersonAddRegular,
  DismissRegular,
  SendRegular,
} from "@fluentui/react-icons";
import { motion } from "framer-motion";

import { ChangeDialog } from "./ChangeDialog";

const useStyles = makeStyles({
  inputContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "4px",
  },
  input: { flex: 1 },
  sharedEmailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    ...shorthands.padding("4px", "0"),
  },
  emailChip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("8px", "12px"),
    transition: "all 0.2s ease",
    ":hover": { backgroundColor: tokens.colorNeutralBackground3Hover },
  },
  removeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    ...shorthands.padding("4px"),
    ...shorthands.borderRadius("50%"),
    transition: "all 0.15s ease",
    ":hover": {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  helperText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    marginTop: "4px",
  },
  listSection: { display: "flex", flexDirection: "column", gap: "8px" },
  sectionLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
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

const ChangeIsPublicDialog: React.FC<ChangeTitleDialogProps> = ({
  isOpen,
  sharedWith,
  onClose,
  onSave,
}) => {
  const styles = useStyles();
  const [sharedWithUsers, setSharedWithUsers] = React.useState<string[]>(
    sharedWith || []
  );
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveClick = () => {
    onSave(sharedWithUsers);
  };

  const handleCancelClick = () => {
    onClose();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (sharedWithUsers.includes(trimmedEmail)) {
      setEmailError("This email is already in the list");
      return;
    }

    setSharedWithUsers([...sharedWithUsers, trimmedEmail]);
    setNewEmail("");
    setEmailError(null);
  };

  const handleRemoveEmail = (email: string) => {
    setSharedWithUsers(sharedWithUsers.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  // Reset state when dialog opens with new props
  React.useEffect(() => {
    if (isOpen) {
      setSharedWithUsers(sharedWith || []);
      setNewEmail("");
      setEmailError(null);
    }
  }, [isOpen, sharedWith]);

  // Focus the input when the dialog opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <ChangeDialog
      title="Make recipe public"
      isOpen={isOpen}
      onClose={onClose}
      actions={
        <>
          <Button appearance="secondary" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSaveClick}
            icon={<SendRegular />}
          >
            Share
          </Button>
        </>
      }
    >
      <>
        <div className={styles.mainContainer}>
          <Text className={styles.helperText}>
            Share this recipe with other users by adding their email addresses
          </Text>

          <div className={styles.inputContainer}>
            <Input
              ref={inputRef}
              className={styles.input}
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) {
                  setEmailError(null);
                }
              }}
              onKeyDown={handleKeyDown}
              type="email"
              placeholder="Enter email address"
              aria-label="Email address"
            />
            <Button
              appearance="subtle"
              icon={<PersonAddRegular />}
              onClick={handleAddEmail}
              aria-label="Add email"
            />
          </div>
          {emailError && (
            <Text
              className={styles.helperText}
              style={{ color: tokens.colorPaletteRedForeground1 }}
            >
              {emailError}
            </Text>
          )}
        </div>
        {sharedWithUsers.length > 0 && (
          <div className={styles.listSection}>
            <Text className={styles.sectionLabel}>Shared with:</Text>
            <div className={styles.sharedEmailsList}>
              {sharedWithUsers.map((email, index) => (
                <motion.div
                  key={email}
                  className={styles.emailChip}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Text>{email}</Text>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveEmail(email)}
                    aria-label={`Remove ${email}`}
                  >
                    <DismissRegular fontSize={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </>
    </ChangeDialog>
  );
};

export default ChangeIsPublicDialog;
