import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Input,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import type { DialogOpenChangeEvent } from "@fluentui/react-components";
import { motion, AnimatePresence } from "framer-motion";

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
    gap: "16px",
  },
  tagInput: {
    width: "100%",
    fontSize: tokens.fontSizeBase300,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  addButton: {
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-1px)",
    },
    minWidth: "40px",
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
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    minHeight: "40px", // Add minimum height to prevent layout shift
  },
  tag: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    padding: "4px 8px",
    ...shorthands.borderRadius("4px"),
    fontSize: tokens.fontSizeBase200,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  tagText: {
    marginRight: "4px",
  },
  noTagsMessage: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    textAlign: "center",
    padding: "16px 0",
  },
});

export type ChangeTagsDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * The current tags of the recipe.
   */
  currentTags: string[];
  /**
   * Callback function to handle saving the updated tags.
   */
  onSave: (updatedTags: string[]) => void;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
  /**
   * Maximum allowed length for a tag
   */
  maxTagLength?: number;
};

// Animation variants
const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, duration: 0.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

export const ChangeTagsDialog: React.FC<ChangeTagsDialogProps> = ({
  isOpen,
  currentTags,
  onSave,
  onClose,
  maxTagLength = 30,
}) => {
  const styles = useStyles();
  const [tags, setTags] = React.useState<string[]>(currentTags);
  const [newTag, setNewTag] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTags(currentTags);
      setNewTag("");
      // Schedule focus on input after the dialog renders
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [currentTags, isOpen]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      // Focus back on input for quick multiple entries
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveClick = () => {
    onSave(tags);
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
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modalType="modal">
      <DialogSurface
        className={styles.dialogSurface}
        aria-describedby={undefined}
        onClick={(ev) => ev.stopPropagation()}
      >
        <DialogTitle className={styles.dialogTitle}>
          Manage Recipe Tags
        </DialogTitle>
        <DialogBody className={styles.dialogBody}>
          <div className={styles.inputContainer}>
            <Input
              placeholder="Add a new tag"
              value={newTag}
              onChange={(_e, data) =>
                setNewTag(data.value.substring(0, maxTagLength))
              }
              className={styles.tagInput}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              maxLength={maxTagLength}
              aria-label="New tag"
            />
            <Button
              icon={<AddRegular />}
              appearance="primary"
              onClick={handleAddTag}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
              className={styles.addButton}
              aria-label="Add tag"
            />
          </div>

          <div className={styles.tagsContainer}>
            <AnimatePresence>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <motion.div
                    key={tag}
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 600,
                      damping: 35,
                    }}
                    className={styles.tag}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span className={styles.tagText}>{tag}</span>
                    <DismissRegular fontSize={12} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.noTagsMessage}
                >
                  No tags added yet. Add a tag to help organize your recipe.
                </motion.div>
              )}
            </AnimatePresence>
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
          >
            Save
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
