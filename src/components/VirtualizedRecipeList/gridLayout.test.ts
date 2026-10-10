import { getFullRowPageSize, getRecipeGridColumnCount } from "./gridLayout";

describe("getRecipeGridColumnCount", () => {
  it("fits as many 280px columns as the width allows after padding and gaps", () => {
    // 3 columns need 3 * 280 + 2 * 16 gaps + 2 * 8 padding = 888px
    expect(getRecipeGridColumnCount(887)).toBe(2);
    expect(getRecipeGridColumnCount(888)).toBe(3);
    expect(getRecipeGridColumnCount(1376)).toBe(4);
  });

  it("never drops below one column", () => {
    expect(getRecipeGridColumnCount(0)).toBe(1);
    expect(getRecipeGridColumnCount(200)).toBe(1);
  });
});

describe("getFullRowPageSize", () => {
  it.each([
    [1, 20],
    [2, 20],
    [3, 21],
    [4, 20],
    [5, 20],
    [6, 24],
    [7, 21],
  ])("fills every row with %i columns (%i recipes)", (columns, expected) => {
    expect(getFullRowPageSize(columns)).toBe(expected);
    expect(expected % columns).toBe(0);
  });
});
