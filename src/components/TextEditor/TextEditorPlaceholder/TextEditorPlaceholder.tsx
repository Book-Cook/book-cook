import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";

import styles from "./TextEditorPlaceholder.module.css";
import type { PlaceholderState } from "./TextEditorPlaceholder.types";

export function TextEditorPlaceholder() {
  const [editor] = useLexicalComposerContext();
  const state = useRef<PlaceholderState | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        let current: PlaceholderState | null = null;

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const element = selection.anchor.getNode().getTopLevelElement();
          if (element?.getType() === "paragraph") {
            const text = element.getTextContent();
            if (text === "") current = { key: element.getKey(), type: "empty" };
            if (text === "/") current = { key: element.getKey(), type: "slash" };
          }
        }

        const prev = state.current;
        if (current?.key === prev?.key && current?.type === prev?.type) return;

        if (prev) {
          editor.getElementByKey(prev.key)?.classList.remove(styles.empty, styles.slash);
        }
        if (current) {
          editor.getElementByKey(current.key)?.classList.add(
            current.type === "empty" ? styles.empty : styles.slash
          );
        }
        state.current = current;
      });
    });
  }, [editor]);

  return null;
}
