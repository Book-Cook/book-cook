import { hasPendingEdits, toEditableData } from "./RecipeProvider";
import type { Recipe } from "../../clientToServer";
import type { EditableData } from "./RecipeProvider.types";

const baseRecipe = {
  _id: "recipe-1",
  title: "Tacos",
  data: "step 1",
  tags: ["mexican"],
  imageURL: "http://example.com/tacos.jpg",
  emoji: "🌮",
  isPublic: true,
} as unknown as Recipe;

describe("toEditableData", () => {
  it("returns empty defaults when recipe is missing", () => {
    const result = toEditableData(null);
    expect(result).toEqual<EditableData>({
      title: "",
      content: "",
      tags: [],
      imageURL: "",
      emoji: "",
      isPublic: false,
      _id: undefined,
    });
  });

  it("maps a recipe to editable data shape", () => {
    const result = toEditableData(baseRecipe);
    expect(result).toEqual({
      title: "Tacos",
      content: "step 1",
      tags: ["mexican"],
      imageURL: "http://example.com/tacos.jpg",
      emoji: "🌮",
      isPublic: true,
      _id: "recipe-1",
    });
  });
});

describe("hasPendingEdits", () => {
  const snapshot = toEditableData(baseRecipe);

  it("returns false when snapshot is null", () => {
    expect(hasPendingEdits(snapshot, null)).toBe(false);
  });

  it("returns false when nothing changed", () => {
    expect(hasPendingEdits(snapshot, snapshot)).toBe(false);
  });

  it("returns true when editable data differs", () => {
    const edited = { ...snapshot, title: "Loaded Tacos" };
    expect(hasPendingEdits(edited, snapshot)).toBe(true);
  });
});
