export const toCssSize = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;
