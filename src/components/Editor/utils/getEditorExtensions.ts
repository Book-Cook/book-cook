import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";

export const getEditorExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Placeholder.configure({ placeholder }),
  Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
  Underline,
];
