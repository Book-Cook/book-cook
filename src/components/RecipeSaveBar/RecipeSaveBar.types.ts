export type SaveBarStatus = "idle" | "saving" | "saved" | "error";

export type RecipeSaveBarProps = {
  status: SaveBarStatus;
  onSave: () => void;
  onCancel: () => void;
  /** Shows a Delete action that stays visible while the recipe is clean. */
  onDelete?: () => void;
  /** Disables every action while a delete is in flight. */
  isDeleting?: boolean;
  /** Shows a "Delete failed" message after a rejected delete. */
  deleteFailed?: boolean;
};
