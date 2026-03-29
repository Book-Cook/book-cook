import { hashString } from "./hashString";
import { hslToRgb } from "./hslToRgb";
import { toHex } from "./toHex";

export const getAvatarColors = (seed: string) => {
  const hash = Math.abs(hashString(seed));
  const hue = (hash % 360) / 360;
  const saturation = 0.55;
  const lightness = 0.52;
  const { r, g, b } = hslToRgb(hue, saturation, lightness);
  const background = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const foreground = luminance > 0.62 ? "#1c1c1c" : "#ffffff";
  return { background, foreground };
};
