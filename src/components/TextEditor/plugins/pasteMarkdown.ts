import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isParagraphNode,
  $setSelection,
} from "lexical";
import type { LexicalNode } from "lexical";

import { importRecipeMarkdown } from "../textEditorConfig";

/** Clipboard flavour Lexical writes when copying from inside an editor. */
export const LEXICAL_CLIPBOARD_TYPE = "application/x-lexical-editor";

const MARKDOWN_PATTERN =
  /^#{1,6}\s|\*\*|__|\*[^*]|^-\s|^\d+\.\s|^>\s|^```|^\|.*\|/m;

export function looksLikeMarkdown(text: string): boolean {
  return MARKDOWN_PATTERN.test(text);
}

/**
 * Converts markdown into detached block nodes.
 *
 * The markdown importer clears its target container and moves the selection to
 * it, so the caller's selection is saved and restored around the conversion.
 */
export function $markdownToNodes(markdown: string): LexicalNode[] {
  const savedSelection = $getSelection()?.clone() ?? null;
  const container = $createParagraphNode();

  importRecipeMarkdown(markdown, container);
  const nodes = container.getChildren();

  $setSelection(savedSelection);
  return nodes;
}

/**
 * Inserts pasted markdown at the current selection.
 *
 * An empty or fully selected document is replaced outright; otherwise the
 * markdown is converted to real block nodes and spliced in at the caret so
 * line breaks, lists and headings survive the paste.
 */
export function $insertPastedMarkdown(markdown: string): void {
  const selection = $getSelection();
  const rootText = $getRoot().getTextContent().trim();
  const isEmptyOrFullySelected =
    rootText === "" ||
    ($isRangeSelection(selection) &&
      selection.getTextContent().trim() === rootText);

  if (isEmptyOrFullySelected) {
    importRecipeMarkdown(markdown);
    return;
  }

  if (!$isRangeSelection(selection)) {
    return;
  }

  const nodes = $markdownToNodes(markdown);
  if (nodes.length === 0) {
    return;
  }

  // Lexical merges the first inserted block into the block holding the caret.
  // Leading a block-level paste with an empty paragraph keeps a pasted heading,
  // list or quote from being absorbed into the current line.
  if (!$isParagraphNode(nodes[0])) {
    nodes.unshift($createParagraphNode());
  }

  const currentSelection = $getSelection();
  if ($isRangeSelection(currentSelection)) {
    currentSelection.insertNodes(nodes);
  }
}
