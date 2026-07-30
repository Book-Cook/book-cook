import { createEditor } from "lexical";

import {
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
