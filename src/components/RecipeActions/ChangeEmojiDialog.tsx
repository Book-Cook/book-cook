import * as React from "react";
import { SearchBox } from "@fluentui/react-components";
import type {
  InputOnChangeData,
  SearchBoxChangeEvent,
} from "@fluentui/react-components";

import { ChangeDialog } from "./ChangeDialog";
import styles from "./ChangeEmojiDialog.module.css";

import { searchFoodEmojis, getDefaultFoodEmojis } from "../../utils/foodEmojis";

const SUGGESTIONS = getDefaultFoodEmojis();
const EMOJI_PATTERN = /\p{Emoji}/u;

const looksLikeEmoji = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  return Array.from(trimmed).length <= 2 && EMOJI_PATTERN.test(trimmed);
};

export type ChangeEmojiDialogProps = {
  isOpen: boolean;
  currentEmoji: string;
  onSave: (newEmoji: string) => void;
  onClose: () => void;
};

const ChangeEmojiDialog: React.FC<ChangeEmojiDialogProps> = ({
  isOpen,
  currentEmoji,
  onSave,
  onClose,
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<string[]>(SUGGESTIONS);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    setQuery("");
    setResults(
      looksLikeEmoji(currentEmoji) && !SUGGESTIONS.includes(currentEmoji)
        ? [currentEmoji, ...SUGGESTIONS]
        : SUGGESTIONS
    );
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isOpen, currentEmoji]);

  const handleChange = (_: SearchBoxChangeEvent, data: InputOnChangeData) => {
    const value = data.value;
    setQuery(value);
    const trimmed = value.trim().toLowerCase();
    setResults(trimmed ? searchFoodEmojis(trimmed) : SUGGESTIONS);
  };

  const handleSelect = (emoji: string) => {
    onSave(emoji);
    onClose();
  };

  const canUseCustom = !results.length && looksLikeEmoji(query);

  return (
    <ChangeDialog isOpen={isOpen} title="Change Recipe Emoji" onClose={onClose}>
      <SearchBox
        placeholder="Search food or paste any emoji"
        appearance="filled-darker"
        value={query}
        onChange={handleChange}
        maxLength={40}
        ref={inputRef}
        aria-label="Recipe emoji search"
      />

      <div className={styles.section}>
        <div className={styles.label}>
          {query.trim() ? "Search results" : "Suggested"}
        </div>

        {results.length ? (
          <div className={styles.grid}>
            {results.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={styles.emoji}
                onClick={() => handleSelect(emoji)}
                aria-label={`Use ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No matches</div>
        )}

        {canUseCustom && (
          <button
            type="button"
            className={styles.pill}
            onClick={() => handleSelect(query.trim())}
          >
            Use {query.trim()}
          </button>
        )}

        {!results.length && !canUseCustom && (
          <div className={styles.empty}>
            Tip: try a food name like &quot;taco&quot; or paste any emoji.
          </div>
        )}
      </div>
    </ChangeDialog>
  );
};

export default ChangeEmojiDialog;
