import * as React from "react";
import { useStyles } from "./TagPicker.styles";
import type { TagFilterProps } from "./TagPicker.types";
import { SearchRegular } from "@fluentui/react-icons";

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Filter by tags",
}) => {
  const styles = useStyles();
  const [tagInput, setTagInput] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter available tags based on input and exclude already selected tags
  const filteredTags = React.useMemo(() => {
    const filtered = availableTags.filter(
      (tag) =>
        !selectedTags.includes(tag) &&
        tag.toLowerCase().includes(tagInput.toLowerCase())
    );
    return filtered;
  }, [availableTags, selectedTags, tagInput]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const handleAddTag = (tagToAdd: string = tagInput.trim()) => {
    if (tagToAdd && !selectedTags.includes(tagToAdd)) {
      onTagsChange([...selectedTags, tagToAdd]);
      setTagInput("");
      inputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
      setIsDropdownOpen(false);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleTagClick = (tag: string) => {
    handleAddTag(tag);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputContainer}>
        <SearchRegular className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={tagInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          aria-label="Search for tags"
        />
        {tagInput.trim() && (
          <button
            className={styles.addButton}
            onClick={() => {
              handleAddTag();
              setIsDropdownOpen(false);
            }}
          >
            Add
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <div
                key={tag}
                className={styles.dropdownItem}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))
          ) : (
            <div className={styles.emptyMessage}>
              {tagInput.trim()
                ? "No matching tags found. Press Enter to create a new tag."
                : "No tags available"}
            </div>
          )}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className={styles.selectedTags}>
          {selectedTags.map((tag) => (
            <div key={tag} className={styles.tagPill}>
              <span>{tag}</span>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove ${tag} tag`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
