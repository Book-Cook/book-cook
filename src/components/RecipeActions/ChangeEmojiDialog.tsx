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
import GraphemeSplitter from "grapheme-splitter";
import * as emoji from "node-emoji";

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
const splitter = new GraphemeSplitter();

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

// Check if a string is a single emoji character
const isSingleEmoji = (value: string): boolean => {
  if (!value) {
    return false;
  }
  const graphemes = splitter.splitGraphemes(value);
  return (
    graphemes.length === 1 &&
    /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(graphemes[0])
  );
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
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedEmoji, setSelectedEmoji] =
    React.useState<string>(DEFAULT_EMOJI);
  const [displayedEmojis, setDisplayedEmojis] = React.useState<string[]>(
    defaultSuggestedEmojis
  );
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      // Initialize state with memoized values to prevent unnecessary re-renders
      const initialEmoji = isSingleEmoji(currentEmoji)
        ? currentEmoji
        : DEFAULT_EMOJI;
      setSelectedEmoji(initialEmoji);
      setDisplayedEmojis(defaultSuggestedEmojis);
      setIsSearching(false);

      // Focus without timeout for faster response
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [isOpen, currentEmoji]);

  // Handle input changes for emoji search
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
      const trimmedValue = newValue.trim().toLowerCase();

      if (isSingleEmoji(trimmedValue)) {
        setSelectedEmoji(trimmedValue);
        setIsSearching(false);
        setDisplayedEmojis(defaultSuggestedEmojis);
      } else if (trimmedValue === "") {
        setSelectedEmoji("");
        setIsSearching(false);
        setDisplayedEmojis(defaultSuggestedEmojis);
      } else {
        setIsSearching(true);
        const searchResults = emoji.search(trimmedValue);
        setDisplayedEmojis(searchResults.map((result) => result.emoji));
      }
    }, 150);
  };

  const handleEmojiGridSelect = React.useCallback(
    (emojiChar: string) => {
      setSelectedEmoji(emojiChar);
      setIsSearching(false);

      if (isSingleEmoji(emojiChar)) {
        onSave(emojiChar);
        onClose();
      }
    },
    [onSave, onClose]
  );

  const emojiGrid = React.useMemo(() => {
    return displayedEmojis.length > 0 ? (
      <div className={styles.emojiGrid}>
        {displayedEmojis.map((emojiChar, index) => (
          <div
            key={`${emojiChar}-${index}`}
            className={`${styles.emojiButton} ${selectedEmoji === emojiChar ? styles.selectedEmoji : ""}`}
            onClick={() => handleEmojiGridSelect(emojiChar)}
            role="button"
            tabIndex={0}
            aria-label={`Select emoji ${emojiChar}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEmojiGridSelect(emojiChar);
              }
            }}
          >
            {emojiChar}
          </div>
        ))}
      </div>
    ) : isSearching ? (
      <Text className={styles.noResultsText}>No emojis found</Text>
    ) : null;
  }, [
    displayedEmojis,
    handleEmojiGridSelect,
    isSearching,
    selectedEmoji,
    styles.emojiButton,
    styles.emojiGrid,
    styles.noResultsText,
    styles.selectedEmoji,
  ]);

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
      </div>
    </ChangeDialog>
  );
};

export default ChangeEmojiDialog;
