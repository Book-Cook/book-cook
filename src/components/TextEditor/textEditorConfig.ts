import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  HEADING,
  ORDERED_LIST,
  QUOTE,
  TEXT_FORMAT_TRANSFORMERS,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import type { ElementNode } from "lexical";

import { HR_TRANSFORMER, TABLE_TRANSFORMER } from "./markdownExtensions";
import styles from "./TextEditor.module.css";
import typography from "../Typography/Typography.module.css";

export const recipeEditorNodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  HorizontalRuleNode,
  TableNode,
  TableCellNode,
  TableRowNode,
];

/** Lexical theme values accept a space-separated class list, so each block keeps
 * the shared Typography primitive for family, weight and colour, and adds an
 * editor-scoped class that owns rhythm, indent and rules. */
const prose = (...classNames: string[]): string => classNames.join(" ");

export const editorTheme = {
  paragraph: prose(typography.bodyText, styles.paragraph),
  heading: {
    h1: prose(typography.sectionHeading, styles.heading, styles.h1),
    h2: prose(typography.sectionHeading, styles.heading, styles.h2),
    h3: prose(typography.subsectionHeading, styles.heading, styles.h3),
  },
  text: {
    bold: typography.bold,
    italic: typography.italic,
    underline: typography.underline,
    strikethrough: typography.strikethrough,
  },
  quote: prose(typography.bodyText, styles.quote),
  hr: styles.hr,
  list: {
    ol: prose(styles.list, styles.ol),
    ul: prose(styles.list, styles.ul),
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

export const importRecipeMarkdown = (
  markdown: string,
  node?: ElementNode
): void => {
  $convertFromMarkdownString(markdown, recipeTransformers, node, true);
};

export const exportRecipeMarkdown = (): string =>
  $convertToMarkdownString(recipeTransformers, undefined, true);

export const hashMarkdownKey = (markdown: string): string => {
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
