import type { MutableRefObject } from "react";
import type { LexicalEditor } from "lexical";

export type TextEditorProps = {
  text: string;
  viewingMode?: "editor" | "viewer";
  onDirty?: () => void;
  editorRef?: MutableRefObject<LexicalEditor | null>;
};
