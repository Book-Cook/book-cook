import { createEditor } from "lexical";

import {
  editorTheme,
  exportRecipeMarkdown,
  importRecipeMarkdown,
  recipeEditorNodes,
} from "./textEditorConfig";

const roundTripMarkdown = (markdown: string): string => {
  const editor = createEditor({
    namespace: "RecipeEditorTest",
    nodes: recipeEditorNodes,
    onError: (error: Error) => {
      throw error;
    },
  });

  editor.update(() => importRecipeMarkdown(markdown), { discrete: true });

  return editor.read(exportRecipeMarkdown);
};

describe("recipe markdown serialization", () => {
  it.each([
    ["adjacent lines", "First line\nSecond line"],
    ["intentional blank lines", "First paragraph\n\nSecond paragraph"],
    ["multiple blank lines", "First paragraph\n\n\nSecond paragraph"],
    [
      "structured recipe content",
      "# Ingredients\n- 1 cup flour\n- 2 eggs\n\n# Method\n1. Mix ingredients\n2. Bake",
    ],
  ])("preserves %s", (_description, markdown) => {
    expect(roundTripMarkdown(markdown)).toBe(markdown);
  });

  it("does not add blank lines over repeated saves", () => {
    const markdown = "First line\nSecond line\nThird line";
    const firstSave = roundTripMarkdown(markdown);
    const secondSave = roundTripMarkdown(firstSave);

    expect(firstSave).toBe(markdown);
    expect(secondSave).toBe(markdown);
  });
});

describe("editor theme", () => {
  it("gives each heading level a distinct class so hierarchy is visible", () => {
    const { h1, h2, h3 } = editorTheme.heading;

    expect(new Set([h1, h2, h3]).size).toBe(3);
  });

  it("styles quotes apart from paragraphs", () => {
    expect(editorTheme.quote).not.toBe(editorTheme.paragraph);
  });

  it("themes every block that carries prose rhythm", () => {
    expect(editorTheme.hr).toBeTruthy();
    expect(editorTheme.paragraph).toBeTruthy();
    expect(editorTheme.list.ul).toBeTruthy();
    expect(editorTheme.list.ol).toBeTruthy();
  });

  it("keeps ordered and unordered lists on a shared rhythm class", () => {
    const shared = editorTheme.list.ul
      .split(" ")
      .filter((className) => editorTheme.list.ol.split(" ").includes(className));

    expect(shared).toHaveLength(1);
  });
});
