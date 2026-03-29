export type SaveBarStatus = "idle" | "saving" | "saved" | "error";

export type RecipeSaveBarProps = {
  status: SaveBarStatus;
  onSave: () => void;
  onCancel: () => void;
};
