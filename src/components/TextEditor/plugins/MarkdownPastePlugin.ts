import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $insertPastedMarkdown,
  LEXICAL_CLIPBOARD_TYPE,
  looksLikeMarkdown,
} from "./pasteMarkdown";

export function MarkdownPastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handler = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        return;
      }

      // Copies made inside a Lexical editor carry full node data — let Lexical
      // restore it rather than degrading it to markdown text.
      if (Array.from(clipboardData.types).includes(LEXICAL_CLIPBOARD_TYPE)) {
        return;
      }

      const text = clipboardData.getData("text/plain");
      if (!text || !looksLikeMarkdown(text)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      editor.update(() => $insertPastedMarkdown(text));
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener("paste", handler, true);
      rootElement?.addEventListener("paste", handler, true); // capture phase
    });
  }, [editor]);

  return null;
}
