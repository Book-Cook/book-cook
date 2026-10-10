import { FloppyDiskIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import styles from "./RecipeSaveBar.module.css";
import type { RecipeSaveBarProps } from "./RecipeSaveBar.types";
import { Button } from "../Button";
import { useRecipeViewSaveState } from "../RecipeView/RecipeViewSaveStateContext";

/**
 * Floating action bar pinned to the top right of a recipe being edited.
 * Delete is always available when `onDelete` is given; Cancel and Save
 * appear once there are unsaved changes.
 * Must be rendered inside a RecipeViewSaveStateProvider.
 */
export const RecipeSaveBar = ({
  status,
  onSave,
  onCancel,
  onDelete,
  isDeleting = false,
  deleteFailed = false,
}: RecipeSaveBarProps) => {
  const saveState = useRecipeViewSaveState();
  const isDirty = saveState?.isDirty ?? false;
  const showSaveActions = isDirty || status !== "idle";
  const isBusy = status === "saving" || isDeleting;

  if (!showSaveActions && !onDelete) {
    return null;
  }

  return (
    <div className={styles.bar} role="status" aria-live="polite">
      {status === "error" && <span className={styles.error}>Save failed</span>}
      {deleteFailed && <span className={styles.error}>Delete failed</span>}
      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          startIcon={<TrashIcon size={14} />}
          disabled={isBusy}
          isLoading={isDeleting}
          onClick={onDelete}
          className={clsx(styles.action, styles.delete)}
        >
          Delete
        </Button>
      )}
      {showSaveActions && (
        <>
          <Button
            variant="ghost"
            size="sm"
            startIcon={<XIcon size={14} />}
            disabled={isBusy}
            onClick={onCancel}
            className={clsx(styles.action, styles.cancel)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            startIcon={<FloppyDiskIcon size={14} />}
            disabled={!isDirty || isBusy}
            isLoading={status === "saving"}
            onClick={onSave}
            className={clsx(styles.action, styles.save)}
          >
            Save
          </Button>
        </>
      )}
    </div>
  );
};
