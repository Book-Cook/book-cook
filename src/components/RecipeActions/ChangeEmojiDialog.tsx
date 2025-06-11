import * as React from "react";
import type {
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import {
  SearchBox,
  makeStyles,
  shorthands,
  tokens,
  Text,
} from "@fluentui/react-components";
import emojiRegex from "emoji-regex";
import * as emoji from "node-emoji";
import emojiData from "unicode-emoji-json";

import { ChangeDialog } from "./ChangeDialog";

// Default emojis for food categories
const defaultSuggestedEmojis = [
  "🍕",
  "🍔",
  "🍗",
  "🍖",
  "🍛",
  "🍜",
  "🍝",
  "🍲",
  "🍳",
  "🥗",
  "🥘",
  "🌮",
  "🌯",
  "🍱",
  "🍚",
  "🥟",
  "🍤",
  "🍙",
  "🧁",
  "🍰",
  "🎂",
  "🍮",
  "🍩",
  "🍪",
  "🍫",
  "🍬",
  "🍷",
  "🍸",
  "🍹",
  "☕",
  "🍵",
  "🍼",
];
const DEFAULT_EMOJI = "🍽️";

const useStyles = makeStyles({
  gridContainer: {
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    ...shorthands.padding("16px"),
  },
  emojiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(38px, 1fr))",
    gap: "4px",
    maxHeight: "250px",
    flexGrow: 1,
    ...shorthands.padding("8px", "0"),
    overflowY: "auto",
  },
  emojiButton: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase600,
    cursor: "pointer",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", "transparent"),
    ...shorthands.borderRadius("8px"),
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    ":focus": {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: "1px",
    },
  },
  selectedEmoji: {
    backgroundColor: tokens.colorNeutralBackground3,
    boxShadow: tokens.shadow2,
    transform: "scale(1.08) translateY(-2px)",
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  emojiSectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "12px",
    color: tokens.colorNeutralForeground2,
  },
  noResultsText: {
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    paddingTop: "30px",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontStyle: "italic",
  },
  primaryButton: {
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    height: "38px",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("8px"),
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  secondaryButton: {
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    height: "38px",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("8px"),
    ":hover": {
      transform: "translateY(-2px)",
    },
  },
});

const isSingleEmoji = (value: string): boolean => {
  if (!value) {
    return false;
  }
  const regex = emojiRegex();
  const match = value.match(regex);
  return Boolean(match) && match?.length === 1 && match[0] === value;
};

const searchByKeyword = (keyword: string): string[] => {
  const results: string[] = [];
  for (const [char, info] of Object.entries(emojiData)) {
    if (info.name.toLowerCase().includes(keyword)) {
      results.push(char);
    }
  }
  return results;
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
  const [inputValue, setInputValue] = React.useState("");
  const [selectedEmoji, setSelectedEmoji] = React.useState(DEFAULT_EMOJI);
  const [displayedEmojis, setDisplayedEmojis] = React.useState(
    defaultSuggestedEmojis
  );
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const initialEmoji = isSingleEmoji(currentEmoji)
        ? currentEmoji
        : DEFAULT_EMOJI;
      setSelectedEmoji(initialEmoji);
      setDisplayedEmojis(defaultSuggestedEmojis);
      setIsSearching(false);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [isOpen, currentEmoji]);

  const handleInputChange = (
    _e: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    const newValue = data.value;
    setInputValue(newValue);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      const trimmed = newValue.trim().toLowerCase();

      if (isSingleEmoji(trimmed)) {
        setSelectedEmoji(trimmed);
        setIsSearching(false);
        setDisplayedEmojis(defaultSuggestedEmojis);
      } else if (trimmed === "") {
        setSelectedEmoji("");
        setIsSearching(false);
        setDisplayedEmojis(defaultSuggestedEmojis);
      } else {
        setIsSearching(true);
        const nameHits = emoji.search(trimmed).map((r) => r.emoji);
        const unicodeHits = searchByKeyword(trimmed);
        const merged = Array.from(new Set([...nameHits, ...unicodeHits]));
        setDisplayedEmojis(merged);
      }
    }, 150);
  };

  const handleEmojiGridSelect = React.useCallback(
    (char: string) => {
      setSelectedEmoji(char);
      setIsSearching(false);
      if (isSingleEmoji(char)) {
        onSave(char);
        onClose();
      }
    },
    [onSave, onClose]
  );

  const emojiGrid = React.useMemo(() => {
    if (displayedEmojis.length > 0) {
      return (
        <div className={styles.emojiGrid}>
          {displayedEmojis.map((char, i) => (
            <div
              key={`${char}-${i}`}
              className={`${styles.emojiButton} ${
                selectedEmoji === char ? styles.selectedEmoji : ""
              }`}
              onClick={() => handleEmojiGridSelect(char)}
              role="button"
              tabIndex={0}
              aria-label={`Select emoji ${char}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEmojiGridSelect(char);
                }
              }}
            >
              {char}
            </div>
          ))}
        </div>
      );
    } else if (isSearching) {
      return <Text className={styles.noResultsText}>No emojis found</Text>;
    } else {
      return null;
    }
  }, [
    displayedEmojis,
    handleEmojiGridSelect,
    isSearching,
    selectedEmoji,
    styles,
  ]);

  // If nothing matched but the user typed a valid emoji, let them “Use it anyway”
  const canUseCustomEmoji =
    displayedEmojis.length === 0 && isSingleEmoji(inputValue.trim());

  const gridTitle = isSearching
    ? `Results for "${inputValue}"`
    : "Common food emojis";

  return (
    <ChangeDialog isOpen={isOpen} title="Change Recipe Emoji" onClose={onClose}>
      <SearchBox
        placeholder="Filter..."
        appearance="filled-darker"
        onChange={handleInputChange}
        value={inputValue}
        ref={inputRef}
        aria-label="Recipe emoji search or selection"
        maxLength={50}
      />
      <div className={styles.gridContainer}>
        <Text className={styles.emojiSectionTitle}>{gridTitle}</Text>
        {emojiGrid}
        {canUseCustomEmoji && (
          <div
            className={styles.emojiButton}
            onClick={() => {
              onSave(inputValue.trim());
              onClose();
            }}
            role="button"
            tabIndex={0}
          >
            Use {`"${inputValue.trim()}"`}
          </div>
        )}
      </div>
    </ChangeDialog>
  );
};

export default ChangeEmojiDialog;
