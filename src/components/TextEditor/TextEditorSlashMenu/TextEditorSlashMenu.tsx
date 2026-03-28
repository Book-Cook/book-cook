import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import type { TextNode } from "lexical";
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";
import * as ReactDOM from "react-dom";

import styles from "./TextEditorSlashMenu.module.css";

export class SlashOption extends MenuOption {
  constructor(public title: string, public tag: "h1" | "h2" | "p") {
    super(title);
  }
}

const OPTIONS = [
  new SlashOption("Heading 1", "h1"),
  new SlashOption("Heading 2", "h2"),
  new SlashOption("Normal Text", "p"),
];

export function SlashMenu() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const checkForSlash = useBasicTypeaheadTriggerMatch("/", { minLength: 0 });

  const onSelectOption = (
    selectedOption: SlashOption,
    nodeToRemove: TextNode | null,
    closeMenu: () => void
  ) => {
    editor.update(() => {
      nodeToRemove?.remove();
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {return;}
      switch (selectedOption.tag) {
        case "h1":
          $setBlocksType(selection, () => $createHeadingNode("h1"));
          break;
        case "h2":
          $setBlocksType(selection, () => $createHeadingNode("h2"));
          break;
        default:
          $setBlocksType(selection, () => $createParagraphNode());
      }
      closeMenu();
    });
  };

  return (
    <LexicalTypeaheadMenuPlugin<SlashOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForSlash}
      options={OPTIONS}
      menuRenderFn={(anchorRef, { selectedIndex, selectOptionAndCleanUp }) => {
        if (anchorRef.current == null || queryString === null) {return null;}
        return ReactDOM.createPortal(
          <div className={styles.menu}>
            {OPTIONS.map((option, i) => (
              <button
                key={option.key}
                className={`${styles.item} ${selectedIndex === i ? styles.selected : ""}`}
                onClick={() => selectOptionAndCleanUp(option)}
                type="button"
              >
                {option.title}
              </button>
            ))}
          </div>,
          anchorRef.current
        );
      }}
    />
  );
}
