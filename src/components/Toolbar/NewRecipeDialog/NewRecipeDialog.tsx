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
  Spinner,
} from "@fluentui/react-components";
import type { DialogOpenChangeEvent } from "@fluentui/react-components";
import { useRouter } from "next/router";

import { useCreateRecipe } from "../../../clientToServer";

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: "450px",
    width: "100%",
    ...shorthands.borderRadius("14px"),
    boxShadow: tokens.shadow16,
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
  errorMessage: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalS,
  },
  spinnerContainer: {
    display: "inline-flex",
    marginLeft: tokens.spacingHorizontalS,
    alignItems: "center",
  },
});

export type NewRecipeDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
};

export const NewRecipeDialog: React.FC<NewRecipeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const styles = useStyles();
  const router = useRouter();
  const [newRecipeTitle, setNewRecipeTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { mutate: createRecipe, isPending } = useCreateRecipe();

  React.useEffect(() => {
    if (isOpen) {
      setNewRecipeTitle("");
      setErrorMessage(null);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const handleSaveClick = () => {
    if (!newRecipeTitle.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    createRecipe(
      {
        title: newRecipeTitle.trim(),
        data: "",
        tags: [],
        imageURL: "",
        emoji: "",
        sharedWith: [],
      },
      {
        onSuccess: async (data) => {
          if (data?.recipeId) {
            onClose();
            await router.push(`/recipes/${data.recipeId}`);
          } else {
            setErrorMessage("Recipe created, but failed to redirect.");
          }
        },
        onError: (error) => {
          console.error("Recipe creation API error:", error);
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to create recipe."
          );
        },
      }
    );
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

  const handleTextChange = (
    _e: React.ChangeEvent<HTMLTextAreaElement>,
    data: { value: string }
  ) => {
    setNewRecipeTitle(data.value.substring(0, 100));
    if (errorMessage) {
      setErrorMessage(null);
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
        <DialogTitle>New Recipe</DialogTitle>
        <DialogBody className={styles.dialogBody}>
          <Textarea
            placeholder="Enter recipe title"
            value={newRecipeTitle}
            onChange={handleTextChange}
            className={styles.textArea}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            maxLength={100}
            aria-label="Recipe title"
            resize="none"
            disabled={isPending}
          />
          <div className={styles.characterCount}>
            {newRecipeTitle.length}/100
          </div>
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </DialogBody>
        <DialogActions className={styles.dialogActions}>
          <Button
            appearance="subtle"
            onClick={handleCancelClick}
            className={styles.secondaryButton}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSaveClick}
            className={styles.primaryButton}
            disabled={!newRecipeTitle.trim() || isPending}
          >
            {isPending ? "Creating..." : "Create Recipe"}
            {isPending && (
              <span className={styles.spinnerContainer}>
                <Spinner size="tiny" />
              </span>
            )}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
