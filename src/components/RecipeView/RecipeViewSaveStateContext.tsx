import { createContext, useContext, useEffect, useRef, useState } from "react";

import type {
  RecipeViewSaveStateProviderProps,
  SaveStateContextValue,
} from "./RecipeViewSaveStateContext.types";

const RecipeViewSaveStateContext = createContext<SaveStateContextValue | null>(null);

export const RecipeViewSaveStateProvider = ({
  initialTitle,
  initialData,
  initialEmoji,
  initialTags,
  children,
}: RecipeViewSaveStateProviderProps) => {
  const initial = useRef({ title: initialTitle, emoji: initialEmoji, tags: initialTags });
  const current = useRef({ title: initialTitle, emoji: initialEmoji, tags: initialTags });
  const dataDirty = useRef(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    initial.current = { title: initialTitle, emoji: initialEmoji, tags: initialTags };
    current.current = { title: initialTitle, emoji: initialEmoji, tags: initialTags };
    dataDirty.current = false;
    setIsDirty(false);
  }, [initialTitle, initialData, initialEmoji, initialTags]);

  const recompute = () => {
    const dirty =
      current.current.title !== initial.current.title ||
      current.current.emoji !== initial.current.emoji ||
      JSON.stringify(current.current.tags) !== JSON.stringify(initial.current.tags) ||
      dataDirty.current;
    setIsDirty(dirty);
  };

  const updateTitle = (title: string) => {
    if (current.current.title === title) {return;}
    current.current.title = title;
    recompute();
  };

  const updateEmoji = (emoji: string) => {
    if (current.current.emoji === emoji) {return;}
    current.current.emoji = emoji;
    recompute();
  };

  const updateTags = (tags: string[]) => {
    current.current.tags = tags;
    recompute();
  };

  const markDataDirty = () => {
    if (dataDirty.current) {return;}
    dataDirty.current = true;
    setIsDirty(true);
  };

  const getTitle = () => current.current.title;
  const getEmoji = () => current.current.emoji;
  const getTags = () => current.current.tags;

  return (
    <RecipeViewSaveStateContext.Provider
      value={{ isDirty, updateTitle, updateEmoji, updateTags, markDataDirty, getTitle, getEmoji, getTags }}
    >
      {children}
    </RecipeViewSaveStateContext.Provider>
  );
};

export const useRecipeViewSaveState = () => useContext(RecipeViewSaveStateContext);
