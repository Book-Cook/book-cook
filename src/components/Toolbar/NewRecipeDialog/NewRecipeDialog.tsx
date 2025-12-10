import * as React from "react";
import {
  Textarea,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Spinner,
} from "@fluentui/react-components";
import { useRouter } from "next/router";

import styles from "./NewRecipeDialog.module.css";
import type { NewRecipeDialogProps } from "./NewRecipeDialog.types";

import { useCreateRecipe } from "../../../clientToServer";

export const NewRecipeDialog: React.FC<NewRecipeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [newRecipeTitle, setNewRecipeTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { mutate: createRecipe, isPending } = useCreateRecipe();

  React.useEffect(() => {
    if (isOpen) {
      setNewRecipeTitle("");
      setErrorMessage(null);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
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
        isPublic: false,
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
      onOpenChange={(_, data) => {
        if (!data.open) {
          onClose();
        }
      }}
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
            onClick={onClose}
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
