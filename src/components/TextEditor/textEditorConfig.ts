import {
  HEADING,
  QUOTE,
  TEXT_FORMAT_TRANSFORMERS,
  ORDERED_LIST,
  UNORDERED_LIST,
} from "@lexical/markdown";

import { HR_TRANSFORMER, TABLE_TRANSFORMER } from "./markdownExtensions";
import styles from "./TextEditor.module.css";
import typography from "../Typography/Typography.module.css";

export const editorTheme = {
  paragraph: typography.bodyText,
  heading: {
    h1: typography.sectionHeading,
    h2: typography.sectionHeading,
    h3: typography.subsectionHeading,
  },
  text: {
    bold: typography.bold,
    italic: typography.italic,
    underline: typography.underline,
    strikethrough: typography.strikethrough,
  },
  quote: typography.bodyText,
  list: {
    ol: styles.ol,
    ul: styles.ul,
    listitem: styles.listItem,
    nested: {
      listitem: styles.nestedListItem,
    },
  },
  table: styles.table,
  tableRow: styles.tableRow,
  tableCell: styles.tableCell,
  tableCellHeader: styles.tableCellHeader,
};

/** Full transformer list — used for markdown import ($convertFromMarkdownString) and export. */
export const recipeTransformers = [
  TABLE_TRANSFORMER,
  HR_TRANSFORMER,
  HEADING,
  QUOTE,
  ORDERED_LIST,
  UNORDERED_LIST,
  ...TEXT_FORMAT_TRANSFORMERS,
];

/** Shortcut-only transformers — passed to MarkdownShortcutPlugin (tables/HR have no keyboard shortcuts). */
export const recipeShortcutTransformers = [
  HEADING,
  QUOTE,
  ORDERED_LIST,
  UNORDERED_LIST,
  ...TEXT_FORMAT_TRANSFORMERS,
];

export const hashMarkdownKey = (markdown: string) => {
  const len = markdown.length;
  const sample =
    len > 8000
      ? `${markdown.slice(0, 4000)}${markdown.slice(len - 4000)}`
      : markdown;
  let hash = 2166136261;
  for (let i = 0; i < sample.length; i += 1) {
    hash ^= sample.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${len}:${hash >>> 0}`;
};
