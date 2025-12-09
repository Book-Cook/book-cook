import * as React from "react";
import { makeStyles, tokens, SearchBox } from "@fluentui/react-components";
import type {
  InputOnChangeData,
  SearchBoxChangeEvent,
} from "@fluentui/react-components";

import { ChangeDialog } from "./ChangeDialog";
import { Text } from "../Text";
import { searchFoodEmojis, getDefaultFoodEmojis } from "../../utils/foodEmojis";

const SUGGESTIONS = getDefaultFoodEmojis();
const EMOJI_PATTERN = /\p{Emoji}/u;

const useStyles = makeStyles({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))",
    gap: "10px",
    maxHeight: "220px",
    overflowY: "auto",
  },
  emoji: {
    border: "1px solid transparent",
    borderRadius: "8px",
    backgroundColor: tokens.colorNeutralBackground3,
    cursor: "pointer",
    fontSize: "24px",
    padding: "10px",
    textAlign: "center",
    transition: "background-color 120ms ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  empty: {
    color: tokens.colorNeutralForeground3,
    padding: "12px 0",
    textAlign: "center",
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    borderRadius: "12px",
    padding: "8px 12px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
  },
});

const isLikelyEmoji = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const glyphCount = Array.from(trimmed).length;
  return glyphCount <= 2 && EMOJI_PATTERN.test(trimmed);
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
  const styles = useStyles();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<string[]>(SUGGESTIONS);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    setQuery("");
    setResults(
      isLikelyEmoji(currentEmoji) && !SUGGESTIONS.includes(currentEmoji)
        ? [currentEmoji, ...SUGGESTIONS]
        : SUGGESTIONS
    );

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isOpen, currentEmoji]);

  const handleChange = (_: SearchBoxChangeEvent, data: InputOnChangeData) => {
    const nextQuery = data.value;
    setQuery(nextQuery);

    const trimmed = nextQuery.trim().toLowerCase();
    if (!trimmed) {
      setResults(SUGGESTIONS);
      return;
    }

    const hits = searchFoodEmojis(trimmed);
    setResults(hits);
  };

  const handleSelect = (emoji: string) => {
    onSave(emoji);
    onClose();
  };

  const canUseCustom = results.length === 0 && isLikelyEmoji(query);

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
        <Text weight="semibold" size={300}>
          {query.trim() ? "Search results" : "Suggested"}
        </Text>

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
          <Text className={styles.empty}>No matches</Text>
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
          <Text size={200} className={styles.empty}>
            Tip: Try a food name like "taco" or paste any emoji.
          </Text>
        )}
      </div>
    </ChangeDialog>
  );
};

export default ChangeEmojiDialog;
