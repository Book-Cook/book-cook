export type Recipe = {
  _id: string;
  imageURL: string;
  title: string;
  createdAt: string;
  data: string;
  tags: string[];
  emoji: string;
  owner: string;
  isPublic: boolean;
  savedCount?: number;
  viewCount?: number;
  publishedAt?: string;
  creatorName?: string;
};

import type { MutableRefObject } from "react";
import type { LexicalEditor } from "lexical";

export type RecipeViewProps = {
  recipe: Recipe;
  viewingMode?: "editor" | "viewer";
  onEdit?: () => void;
  editorRef?: MutableRefObject<LexicalEditor | null>;
};
