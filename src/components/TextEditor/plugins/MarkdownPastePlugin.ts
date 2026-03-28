import { useEffect } from "react";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";
import { recipeTransformers } from "../textEditorConfig";

function looksLikeMarkdown(text: string): boolean {
  return /^#{1,6}\s|\*\*|__|\*[^*]|^-\s|^\d+\.\s|^>\s|^```/m.test(text);
}

export function MarkdownPastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;

    const handler = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain");
      if (!text || !looksLikeMarkdown(text)) return;

      event.preventDefault();
      event.stopPropagation();

      editor.update(() => {
        const selection = $getSelection();
        const rootText = $getRoot().getTextContent().trim();
        const isEmptyOrFullySelected =
          rootText === "" ||
          ($isRangeSelection(selection) &&
            selection.getTextContent().trim() === rootText);

        if (isEmptyOrFullySelected) {
          $convertFromMarkdownString(text, recipeTransformers, undefined, true);
        } else if ($isRangeSelection(selection)) {
          selection.insertText(text);
        }
      });
    };

    root.addEventListener("paste", handler, true); // capture phase
    return () => root.removeEventListener("paste", handler, true);
  }, [editor]);

  return null;
}
