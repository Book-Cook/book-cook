// Import only the specific extensions we need from StarterKit
// instead of the entire StarterKit bundle
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";

export const getEditorExtensions = (placeholder: string) => [
  // Core document structure
  Document,
  Paragraph,
  Text,
  
  // Basic formatting
  Bold,
  Italic,
  Underline,
  
  // Headers (only levels we actually use)
  Heading.configure({ levels: [1, 2, 3] }),
  
  // Lists
  BulletList,
  OrderedList,
  ListItem,
  
  // Interactive features
  Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
  Placeholder.configure({ placeholder }),
];
