import { useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";

import styles from "./RecipeTags.module.css";
import type { RecipeTagsProps } from "./RecipeTags.types";

import { Tag } from "../../../Tag";

export const RecipeTags = ({
  tags,
  onTagClick,
  editable,
  onTagsChange,
}: RecipeTagsProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || tags.includes(tag)) {return;}
    onTagsChange?.([...tags, tag]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onTagsChange?.(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  if (!editable) {
    return (
      <div className={styles.tagList}>
        {tags.map((tag) => (
          <Tag key={tag} onClick={onTagClick ? () => onTagClick(tag) : undefined}>
            {tag}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.tagEditor} onClick={() => inputRef.current?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className={styles.editableTag}>
          {tag}
          <button
            type="button"
            className={styles.removeBtn}
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            aria-label={`Remove tag ${tag}`}
          >
            <XIcon size={10} weight="bold" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className={styles.tagInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue) {addTag(inputValue);} }}
        placeholder={tags.length === 0 ? "Add tags…" : ""}
        size={Math.max(inputValue.length + 1, tags.length === 0 ? 10 : 2)}
      />
    </div>
  );
};
