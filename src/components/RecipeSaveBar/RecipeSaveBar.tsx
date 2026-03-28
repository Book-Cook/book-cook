import { Button } from "../Button";
import { useRecipeViewSaveState } from "../RecipeView/RecipeViewSaveStateContext";
import styles from "./RecipeSaveBar.module.css";
import type { RecipeSaveBarProps } from "./RecipeSaveBar.types";

/**
 * Persistent floating save bar that appears while editing a recipe.
 * Must be rendered inside a RecipeViewSaveStateProvider.
 */
export const RecipeSaveBar = ({ status, onSave, onCancel }: RecipeSaveBarProps) => {
  const saveState = useRecipeViewSaveState();
  const isDirty = saveState?.isDirty ?? false;

  if (!isDirty && status === "idle") {
    return null;
  }

  return (
    <div className={styles.bar} role="status" aria-live="polite">
      {status === "error" && (
        <span className={styles.error}>Save failed</span>
      )}
      <Button
        variant="ghost"
        size="sm"
        disabled={status === "saving"}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="sm"
        disabled={!isDirty || status === "saving"}
        isLoading={status === "saving"}
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  );
};
