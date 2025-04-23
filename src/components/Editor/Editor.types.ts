import type { Content } from "@tiptap/react";

export type EditorProps = {
  value: Content;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};
