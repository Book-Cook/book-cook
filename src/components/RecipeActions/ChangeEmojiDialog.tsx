import * as React from "react";
import {
  Input,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Text,
} from "@fluentui/react-components";
import type { DialogOpenChangeEvent } from "@fluentui/react-components";

const commonEmojis = [
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

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: "450px",
    width: "100%",
    ...shorthands.borderRadius("14px"),
    boxShadow: tokens.shadow16,
  },
  dialogTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "4px",
  },
  dialogBody: {
    paddingTop: "12px",
    paddingBottom: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emojiInput: {
    width: "100%",
    fontSize: tokens.fontSizeBase500,
    textAlign: "center",
  },
  emojiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "12px",
    marginTop: "8px",
  },
  emojiButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase500,
    cursor: "pointer",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius("4px"),
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      transform: "scale(1.1)",
    },
    ":focus": {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: tokens.colorBrandStroke1,
    },
  },
  selectedEmoji: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  emojiSectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "16px",
    marginBottom: "8px",
  },
  dialogActions: {
    paddingTop: "0",
    ...shorthands.gap("12px"),
  },
  primaryButton: {
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  },
  secondaryButton: {
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-1px)",
    },
  },
});

export type ChangeEmojiDialogProps = {
  /**
   * Whether the dialog is open or closed.
   */
  isOpen: boolean;
  /**
   * The current emoji of the recipe.
   */
  currentEmoji: string;
  /**
   * Callback function to handle saving the new emoji.
   */
  onSave: (newEmoji: string) => void;
  /**
   * Callback function to handle closing the dialog.
   */
  onClose: () => void;
};

export const ChangeEmojiDialog: React.FC<ChangeEmojiDialogProps> = ({
  isOpen,
  currentEmoji,
  onSave,
  onClose,
}) => {
  const styles = useStyles();
  const [emoji, setEmoji] = React.useState(currentEmoji || "🍽️");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setEmoji(currentEmoji || "🍽️");
      // Schedule focus after the dialog renders
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [currentEmoji, isOpen]);

  const handleSaveClick = () => {
    if (emoji.trim()) {
      onSave(emoji.trim());
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleOpenChange = (
    _event: DialogOpenChangeEvent,
    data: { open: boolean }
  ) => {
    if (!data.open) {
      onClose();
    }
  };

  const handleEmojiSelect = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modalType="modal">
      <DialogSurface
        className={styles.dialogSurface}
        aria-describedby={undefined}
        onClick={(ev) => ev.stopPropagation()}
      >
        <DialogTitle className={styles.dialogTitle}>
          Change Recipe Emoji
        </DialogTitle>
        <DialogBody className={styles.dialogBody}>
          <Input
            placeholder="Type or paste an emoji"
            value={emoji}
            onChange={(_e, data) => setEmoji(data.value)}
            className={styles.emojiInput}
            ref={inputRef}
            aria-label="Recipe emoji"
          />

          <Text className={styles.emojiSectionTitle}>Common food emojis</Text>
          <div className={styles.emojiGrid}>
            {commonEmojis.map((emojiChar) => (
              <div
                key={emojiChar}
                className={`${styles.emojiButton} ${emoji === emojiChar ? styles.selectedEmoji : ""}`}
                onClick={() => handleEmojiSelect(emojiChar)}
                role="button"
                tabIndex={0}
                aria-label={`Select emoji ${emojiChar}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleEmojiSelect(emojiChar);
                  }
                }}
              >
                {emojiChar}
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogActions className={styles.dialogActions}>
          <Button
            appearance="subtle"
            onClick={handleCancelClick}
            className={styles.secondaryButton}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSaveClick}
            className={styles.primaryButton}
          >
            Save
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
