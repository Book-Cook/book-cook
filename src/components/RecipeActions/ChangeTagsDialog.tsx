import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Input,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: "450px",
    width: "100%",
    ...shorthands.borderRadius("14px"),
  },
  dialogBody: { display: "flex", flexDirection: "column", gap: "16px" },
  inputContainer: { display: "flex", alignItems: "center", gap: "8px" },
  dropdownContainer: { position: "relative", width: "100%" },
  suggestionsDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius("4px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow8,
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 100,
  },
  suggestionItem: {
    ...shorthands.padding("8px"),
    cursor: "pointer",
    ":hover": { backgroundColor: tokens.colorNeutralBackground2 },
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    minHeight: "40px",
  },
  dialogTitle: {
    paddingBottom: "8px",
  },
  tag: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "4px 8px",
    ...shorthands.borderRadius("4px"),
    fontSize: tokens.fontSizeBase200,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    ":hover": { backgroundColor: tokens.colorNeutralBackground3 },
  },
  noTagsMessage: {
    color: tokens.colorNeutralForeground3,
    padding: "16px 0",
    textAlign: "center",
  },
});

export type ChangeTagsDialogProps = {
  isOpen: boolean;
  currentTags: string[];
  onSave: (updatedTags: string[]) => void;
  onClose: () => void;
  availableTags?: string[];
};

const maxTagLength = 30;

const ChangeTagsDialog: React.FC<ChangeTagsDialogProps> = ({
  isOpen,
  currentTags,
  onSave,
  onClose,
  availableTags = [],
}) => {
  const styles = useStyles();
  const [tags, setTags] = React.useState<string[]>(currentTags);
  const [newTag, setNewTag] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Get filtered suggestions
  const suggestions = React.useMemo(() => {
    if (!newTag.trim()) {
      return [];
    }
    return availableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(newTag.toLowerCase()) &&
          !tags.includes(tag) &&
          tag.toLowerCase() !== newTag.toLowerCase()
      )
      .slice(0, 5);
  }, [availableTags, newTag, tags]);

  // Handlers
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    ev.stopPropagation();
    if (ev.key === "Enter") {
      ev.preventDefault();
      handleAddTag();
    } else if (ev.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Reset and focus on open
  React.useEffect(() => {
    if (isOpen) {
      setTags(currentTags);
      setNewTag("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentTags, isOpen]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        inputRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(ev, data) => {
        ev.stopPropagation();
        return !data.open && onClose();
      }}
      modalType="modal"
      surfaceMotion={null}
    >
      <DialogSurface
        className={styles.dialogSurface}
        onClick={(ev) => ev.stopPropagation()}
      >
        <DialogTitle className={styles.dialogTitle}>
          Manage Recipe Tags
        </DialogTitle>
        <DialogBody className={styles.dialogBody}>
          <div className={styles.inputContainer}>
            <div className={styles.dropdownContainer}>
              <Input
                placeholder="Add a new tag"
                value={newTag}
                onChange={(_, data) => {
                  setNewTag(
                    data.value.substring(0, maxTagLength).toLowerCase()
                  );
                  setShowSuggestions(true);
                }}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onFocus={() => newTag.trim() && setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown} ref={dropdownRef}>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className={styles.suggestionItem}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (!tags.includes(suggestion)) {
                          setTags([...tags, suggestion]);
                          setNewTag("");
                          setShowSuggestions(false);
                          inputRef.current?.focus();
                        }
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              icon={<AddRegular />}
              appearance="primary"
              onClick={handleAddTag}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
            />
          </div>
          <div className={styles.tagsContainer}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag}
                  className={styles.tag}
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  <span>{tag}</span>
                  <DismissRegular fontSize={12} />
                </div>
              ))
            ) : (
              <div className={styles.noTagsMessage}>
                No tags added yet. Add a tag to help organize your recipe.
              </div>
            )}
          </div>
        </DialogBody>
        <DialogActions>
          <Button appearance="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={() => onSave(tags)}>
            Save
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default ChangeTagsDialog;
