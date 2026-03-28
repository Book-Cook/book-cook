import { useState } from "react";
import { TagIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { Command } from "cmdk";

import { Tag } from "../Tag";
import styles from "./MultiSelectMenu.module.css";
import type { MultiSelectMenuProps } from "./MultiSelectMenu.types";

const MAX_VISIBLE = 2;

export const MultiSelectMenu = ({
  options,
  value,
  onChange,
  label,
  emptyMessage = "No options available",
  className,
}: MultiSelectMenuProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter(
    (opt) =>
      !value.includes(opt) &&
      opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (option: string) => {
    onChange([...value, option]);
    setSearch("");
  };

  const handleRemove = (option: string) => {
    onChange(value.filter((v) => v !== option));
  };

  const visibleTags = value.slice(0, MAX_VISIBLE);
  const overflowCount = value.length - MAX_VISIBLE;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Command shouldFilter={false} className={styles.command}>
        <div
          className={styles.inputControl}
          onMouseDown={(e) => {
            const input = e.currentTarget.querySelector("input");
            if (e.target !== input) {
              e.preventDefault();
              input?.focus();
            }
          }}
        >
          <TagIcon size={16} className={styles.inputIcon} aria-hidden="true" />
          {visibleTags.map((tag) => (
            <Tag key={tag} onClick={() => handleRemove(tag)}>
              {tag}
            </Tag>
          ))}
          {overflowCount > 0 && (
            <span className={styles.overflow}>+{overflowCount}</span>
          )}
          <Command.Input
            className={styles.input}
            value={search}
            onValueChange={setSearch}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={value.length === 0 ? "Filter tags" : ""}
            aria-label={label}
          />
        </div>
        {open && (
          <Command.List className={styles.dropdown}>
            {filtered.length === 0 ? (
              <Command.Empty className={styles.empty}>
                {search ? "No matching tags" : emptyMessage}
              </Command.Empty>
            ) : (
              filtered.map((option) => (
                <Command.Item
                  key={option}
                  value={option}
                  onSelect={() => handleAdd(option)}
                  className={styles.item}
                >
                  {option}
                </Command.Item>
              ))
            )}
          </Command.List>
        )}
      </Command>
    </div>
  );
};
