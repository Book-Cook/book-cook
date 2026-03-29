import { RecipeHeader } from "./RecipeHeader";
import styles from "./RecipeView.module.css";
import type { RecipeViewProps } from "./RecipeView.types";
import { useRecipeViewSaveState } from "./RecipeViewSaveStateContext";
import { TextEditor } from "../TextEditor";

/** Strip legacy HTML content so it doesn't render as raw tags in the editor. */
function normalizeData(data: string): string {
  if (!data?.includes("<")) {return data;}
  return data
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export const RecipeView = ({
  recipe,
  viewingMode = "viewer",
  onEdit,
  editorRef,
}: RecipeViewProps) => {
  const saveState = useRecipeViewSaveState();

  return (
    <section className={styles.container}>
      <RecipeHeader recipe={recipe} viewingMode={viewingMode} onEdit={onEdit} />
      <div className={styles.content}>
        <TextEditor
          text={normalizeData(recipe.data ?? "")}
          viewingMode={viewingMode}
          onDirty={saveState?.markDataDirty}
          editorRef={editorRef}
        />
      </div>
    </section>
  );
};
