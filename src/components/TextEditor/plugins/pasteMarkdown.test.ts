import { $getRoot, createEditor } from "lexical";
import type { LexicalEditor } from "lexical";

import { $insertPastedMarkdown, looksLikeMarkdown } from "./pasteMarkdown";
import {
  exportRecipeMarkdown,
  importRecipeMarkdown,
  recipeEditorNodes,
} from "../textEditorConfig";

const createRecipeEditor = (initialMarkdown: string): LexicalEditor => {
  const editor = createEditor({
    namespace: "RecipePasteTest",
    nodes: recipeEditorNodes,
    onError: (error: Error) => {
      throw error;
    },
  });

  editor.update(() => importRecipeMarkdown(initialMarkdown), {
    discrete: true,
  });

  return editor;
};

const pasteAtEnd = (initialMarkdown: string, pasted: string): string => {
  const editor = createRecipeEditor(initialMarkdown);

  editor.update(
    () => {
      $getRoot().getLastDescendant()?.selectEnd();
      $insertPastedMarkdown(pasted);
    },
    { discrete: true }
  );

  return editor.read(exportRecipeMarkdown);
};

describe("looksLikeMarkdown", () => {
  it.each([
    ["heading", "# Ingredients"],
    ["bullet list", "- 2 eggs"],
    ["ordered list", "1. Mix"],
    ["quote", "> Rest overnight"],
    ["bold", "Add **salt**"],
    ["table", "| a | b |"],
  ])("detects %s", (_description, text) => {
    expect(looksLikeMarkdown(text)).toBe(true);
  });

  it("ignores plain prose", () => {
    expect(looksLikeMarkdown("Preheat the oven\nThen bake it")).toBe(false);
  });
});

describe("pasting markdown into a populated editor", () => {
  it("keeps pasted line breaks instead of collapsing them into one text node", () => {
    const editor = createRecipeEditor("# Recipe\nExisting line");

    editor.update(
      () => {
        $getRoot().getLastDescendant()?.selectEnd();
        $insertPastedMarkdown("- eggs\n- flour");
      },
      { discrete: true }
    );

    const textNodesWithNewlines = editor.read(() =>
      $getRoot()
        .getAllTextNodes()
        .filter((node) => node.getTextContent().includes("\n"))
    );

    expect(textNodesWithNewlines).toHaveLength(0);
  });

  it("converts a pasted bullet list into real list nodes", () => {
    const editor = createRecipeEditor("# Recipe\nExisting line");

    editor.update(
      () => {
        $getRoot().getLastDescendant()?.selectEnd();
        $insertPastedMarkdown("- eggs\n- flour");
      },
      { discrete: true }
    );

    const listCount = editor.read(
      () =>
        $getRoot()
          .getChildren()
          .filter((node) => node.getType() === "list").length
    );

    expect(listCount).toBe(1);
  });

  it("preserves headings and adjacent lines from pasted markdown", () => {
    const result = pasteAtEnd(
      "# Recipe",
      "## Ingredients\n- eggs\n- flour\n\n## Method\n1. Mix\n2. Bake"
    );

    expect(result).toContain("## Ingredients");
    expect(result).toContain("- eggs\n- flour");
    expect(result).toContain("1. Mix\n2. Bake");
  });

  it("replaces the document when the editor is empty", () => {
    const result = pasteAtEnd("", "# Recipe\nFirst line\nSecond line");

    expect(result).toBe("# Recipe\nFirst line\nSecond line");
  });

  it("merges a single pasted paragraph inline instead of starting a new block", () => {
    const result = pasteAtEnd("Add the **salt**", " and pepper");

    expect(result).toBe("Add the **salt** and pepper");
  });

  it("does not gain blank lines when pasted content is saved and reloaded", () => {    const firstSave = pasteAtEnd("# Recipe\nExisting line", "- eggs\n- flour");
    const editor = createRecipeEditor(firstSave);
    const secondSave = editor.read(exportRecipeMarkdown);

    expect(secondSave).toBe(firstSave);
  });
});
