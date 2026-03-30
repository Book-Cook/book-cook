import * as React from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

import { ChangeDialog } from "./ChangeDialog";
import styles from "./ChangeTagsDialog.module.css";
import { Button } from "../Button";
import { Input } from "../Input";

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
    <ChangeDialog
      isOpen={isOpen}
      title="Manage Recipe Tags"
      onClose={onClose}
      actions={
        <>
          <Button appearance="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={() => onSave(tags)}>
            Save
          </Button>
        </>
      }
    >
      <div className={styles.inputContainer}>
        <div className={styles.dropdownContainer}>
          <Input
            placeholder="Add a new tag"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value.substring(0, maxTagLength).toLowerCase());
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
          icon={<PlusIcon />}
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
              <XIcon size={12} />
            </div>
          ))
        ) : (
          <div className={styles.noTagsMessage}>
            No tags added yet. Add a tag to help organize your recipe.
          </div>
        )}
      </div>
    </ChangeDialog>
  );
};

export default ChangeTagsDialog;
