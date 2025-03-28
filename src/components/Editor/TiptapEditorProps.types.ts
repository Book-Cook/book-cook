import type { Content } from "@tiptap/react";

export type TiptapEditorProps = {
  value: Content;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};
