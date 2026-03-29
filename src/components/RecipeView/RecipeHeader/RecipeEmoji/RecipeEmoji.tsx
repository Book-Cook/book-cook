import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

import styles from "./RecipeEmoji.module.css";
import type { RecipeEmojiProps } from "./RecipeEmoji.types";

const FOOD_EMOJIS = [
  "🍕","🍔","🌮","🌯","🥗","🍜","🍝","🍲","🍛","🍣",
  "🍱","🥘","🫕","🥙","🧆","🥚","🍳","🧇","🥞","🧈",
  "🍞","🥐","🥨","🥯","🧀","🥦","🥕","🌽","🫑","🍅",
  "🥑","🫐","🍓","🍇","🍊","🍋","🍎","🍐","🍑","🍒",
  "🍰","🎂","🧁","🍩","🍪","🍫","🍬","🍭","🍦","🍨",
  "☕","🧃","🍵","🧋","🍺","🍷","🥂","🫖","🥤","🍹",
  "🥩","🍗","🍖","🌭","🥓","🦀","🦞","🦐","🦑","🍤",
  "🫙","🥫","🧂","🫒","🌶️","🧄","🧅","🥜","🫘","🌰",
];

export const RecipeEmoji = ({ emoji, hasCover, onEmojiChange }: RecipeEmojiProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {return;}
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const emojiClass = clsx(styles.emoji, !hasCover && styles.emojiNoCover);

  if (!onEmojiChange) {
    return (
      <div className={emojiClass} aria-hidden="true">
        {emoji}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.pickerRoot}>
      <button
        className={clsx(emojiClass, styles.emojiBtn)}
        onClick={() => setOpen((o) => !o)}
        aria-label="Change emoji"
        type="button"
        title="Change emoji"
      >
        {emoji}
      </button>
      {open && (
        <div className={styles.picker}>
          {FOOD_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className={clsx(styles.pickerItem, e === emoji && styles.pickerItemActive)}
              onClick={() => {
                onEmojiChange(e);
                setOpen(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
