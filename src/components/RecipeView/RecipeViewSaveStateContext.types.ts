import type { ReactNode } from "react";

export type SaveStateContextValue = {
  isDirty: boolean;
  updateTitle: (title: string) => void;
  updateEmoji: (emoji: string) => void;
  updateTags: (tags: string[]) => void;
  markDataDirty: () => void;
  getTitle: () => string;
  getEmoji: () => string;
  getTags: () => string[];
};

export type RecipeViewSaveStateProviderProps = {
  initialTitle: string;
  initialData: string;
  initialEmoji: string;
  initialTags: string[];
  children: ReactNode;
};
