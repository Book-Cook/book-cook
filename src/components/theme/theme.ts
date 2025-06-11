import type { BrandVariants, Theme } from "@fluentui/react-components";
import { createDarkTheme, createLightTheme } from "@fluentui/react-components";
import chroma from "chroma-js";

export type ThemeMode = "light" | "dark";

// --- Configuration ---
const NEUTRAL_SATURATION_LIGHT = 0.05;
const NEUTRAL_SATURATION_DARK = 0.1;
const PRIMARY_BRAND_SHADE_INDEX: keyof BrandVariants = 80;
const FONT_FAMILY_BASE = `"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`;
const FALLBACK_PRIMARY_COLOR = "#6264a7";

// --- Color Scale Generation ---
const generateFallbackVariants = (): BrandVariants => {
  const gray = chroma("#808080");
  return {
    10: gray.brighten(4).hex(),
    20: gray.brighten(3.5).hex(),
    30: gray.brighten(3).hex(),
    40: gray.brighten(2).hex(),
    50: gray.brighten(1).hex(),
    60: gray.hex(),
    70: gray.darken(0.5).hex(),
    80: gray.darken(1).hex(),
    90: gray.darken(1.5).hex(),
    100: gray.darken(2).hex(),
    110: gray.darken(2.5).hex(),
    120: gray.darken(3).hex(),
    130: gray.darken(3.5).hex(),
    140: gray.darken(4).hex(),
    150: gray.darken(4.5).hex(),
    160: gray.darken(5).hex(),
  };
};

export const generateBrandVariants = (primaryColor: string): BrandVariants => {
  try {
    const safePrimaryColor =
      typeof primaryColor === "string"
        ? primaryColor.trim()
        : FALLBACK_PRIMARY_COLOR;

    const primary = chroma(safePrimaryColor);
    const [primaryH, primaryS, primaryL] = primary.hsl();

    if (isNaN(primaryH)) {
      console.warn("NaN hue detected for color:", safePrimaryColor);
      return generateFallbackVariants();
    }

    const variants: Partial<BrandVariants> = {};
    const steps: (keyof BrandVariants)[] = [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    ];
    const minL = 0.02;
    const maxL = 0.98;
    const targetIndex = steps.indexOf(PRIMARY_BRAND_SHADE_INDEX);

    steps.forEach((step, index) => {
      const ratio = index / (steps.length - 1);
      let targetL: number;

      if (index <= targetIndex) {
        targetL = maxL - (maxL - primaryL) * (index / targetIndex);
      } else {
        const stepsAfterTarget = steps.length - 1 - targetIndex;
        targetL =
          primaryL -
          (primaryL - minL) * ((index - targetIndex) / stepsAfterTarget);
      }

      const saturationFactor = 1 - Math.abs(ratio - 0.5) * 0.4;
      const targetS = primaryS * saturationFactor;

      variants[step] = chroma
        .hsl(primaryH, targetS, Math.max(minL, Math.min(maxL, targetL)))
        .hex();
    });

    return variants as BrandVariants;
  } catch (error) {
    console.error("Error generating brand variants:", error);
    return generateFallbackVariants();
  }
};

const createBrandTokens = (brand: BrandVariants) => ({
  colorBrandForeground1: brand[80],
  colorBrandForeground2: brand[70],
  colorBrandBackground: brand[80],
  colorBrandBackground2: brand[20],
  colorBrandBackgroundHover: brand[70],
  colorBrandBackgroundPressed: brand[60],
  colorBrandBackgroundSelected: brand[80],
  colorBrandStroke1: brand[70],
  colorBrandStroke2: brand[80],
  colorCompoundBrandForeground1: brand[80],
  colorCompoundBrandForeground1Hover: brand[70],
  colorCompoundBrandForeground1Pressed: brand[90],
  colorCompoundBrandBackground: brand[80],
  colorCompoundBrandBackgroundHover: brand[70],
  colorCompoundBrandBackgroundPressed: brand[60],
});

const createBrandTokensDark = (brand: BrandVariants) => ({
  colorBrandForeground1: brand[80],
  colorBrandForeground2: brand[90],
  colorBrandBackground: brand[70],
  colorBrandBackground2: brand[120],
  colorBrandBackgroundHover: brand[60],
  colorBrandBackgroundPressed: brand[50],
  colorBrandBackgroundSelected: brand[70],
  colorBrandStroke1: brand[70],
  colorBrandStroke2: brand[80],
  colorCompoundBrandForeground1: brand[80],
  colorCompoundBrandForeground1Hover: brand[70],
  colorCompoundBrandForeground1Pressed: brand[90],
  colorCompoundBrandBackground: brand[70],
  colorCompoundBrandBackgroundHover: brand[60],
  colorCompoundBrandBackgroundPressed: brand[50],
});

const createNeutralTokensLight = (hue: number) => {
  const get = (l: number) => chroma.hsl(hue, NEUTRAL_SATURATION_LIGHT, l).hex();
  return {
    colorNeutralBackground1: get(0.98),
    colorNeutralBackground1Hover: get(0.96),
    colorNeutralBackground1Pressed: get(0.92),
    colorNeutralBackground1Selected: get(0.9),
    colorNeutralBackground2: "#ffffff",
    colorNeutralBackground2Hover: get(0.96),
    colorNeutralBackground2Pressed: get(0.92),
    colorNeutralBackground2Selected: get(0.9),
    colorNeutralBackground3: get(0.95),
    colorNeutralBackground3Hover: get(0.92),
    colorNeutralBackground3Pressed: get(0.88),
    colorNeutralBackground3Selected: get(0.86),
    colorNeutralBackground4: get(0.92),
    colorNeutralBackground5: get(0.88),
    colorNeutralBackground6: get(0.85),

    colorNeutralForeground1: get(0.2),
    colorNeutralForeground2: get(0.35),
    colorNeutralForeground3: get(0.5),
    colorNeutralForeground4: get(0.6),
    colorNeutralForegroundDisabled: get(0.65),
    colorNeutralForegroundOnBrand: "#ffffff",

    colorNeutralStroke1: get(0.8),
    colorNeutralStroke2: get(0.9),
    colorNeutralStroke3: get(0.95),
    colorNeutralStrokeAccessible: get(0.4),
    colorNeutralStrokeAccessibleHover: get(0.35),
    colorNeutralStrokeDisabled: get(0.85),
    colorNeutralStrokeOnBrand: "#ffffff",

    colorSubtleBackground: get(0.96),
    colorSubtleBackgroundHover: get(0.94),
    colorSubtleBackgroundPressed: get(0.9),
    colorSubtleBackgroundSelected: get(0.88),
  };
};

const createNeutralTokensDark = (hue: number) => {
  const get = (l: number) => chroma.hsl(hue, NEUTRAL_SATURATION_DARK, l).hex();
  return {
    colorNeutralBackground1: get(0.12),
    colorNeutralBackground1Hover: get(0.18),
    colorNeutralBackground1Pressed: get(0.08),
    colorNeutralBackground1Selected: get(0.22),
    colorNeutralBackground2: get(0.08),
    colorNeutralBackground2Hover: get(0.14),
    colorNeutralBackground2Pressed: get(0.04),
    colorNeutralBackground2Selected: get(0.18),
    colorNeutralBackground3: get(0.16),
    colorNeutralBackground3Hover: get(0.22),
    colorNeutralBackground3Pressed: get(0.12),
    colorNeutralBackground3Selected: get(0.26),
    colorNeutralBackground4: get(0.2),
    colorNeutralBackground5: get(0.25),
    colorNeutralBackground6: get(0.3),

    colorNeutralForeground1: get(0.95),
    colorNeutralForeground2: get(0.85),
    colorNeutralForeground3: get(0.7),
    colorNeutralForeground4: get(0.6),
    colorNeutralForegroundDisabled: get(0.45),
    colorNeutralForegroundOnBrand: "#ffffff",

    colorNeutralStroke1: get(0.35),
    colorNeutralStroke2: get(0.25),
    colorNeutralStroke3: get(0.2),
    colorNeutralStrokeAccessible: get(0.65),
    colorNeutralStrokeAccessibleHover: get(0.75),
    colorNeutralStrokeDisabled: get(0.3),
    colorNeutralStrokeOnBrand: get(0.1),

    colorSubtleBackground: get(0.18),
    colorSubtleBackgroundHover: get(0.24),
    colorSubtleBackgroundPressed: get(0.14),
    colorSubtleBackgroundSelected: get(0.28),
  };
};

export const createDynamicLightTheme = (brand: BrandVariants): Theme => {
  const baseTheme = createLightTheme(brand);
  const brandHue = chroma(brand[PRIMARY_BRAND_SHADE_INDEX]).get("hsl.h");
  const neutralTokens = createNeutralTokensLight(brandHue);

  return {
    ...baseTheme,
    ...createBrandTokens(brand),
    ...neutralTokens,
    colorNeutralStrokeAccessibleSelected: brand[70],
    fontFamilyBase: FONT_FAMILY_BASE,
  };
};

export const createDynamicDarkTheme = (brand: BrandVariants): Theme => {
  const baseTheme = createDarkTheme(brand);
  const brandHue = chroma(brand[PRIMARY_BRAND_SHADE_INDEX]).get("hsl.h");
  const neutralTokens = createNeutralTokensDark(brandHue);

  return {
    ...baseTheme,
    ...createBrandTokensDark(brand),
    ...neutralTokens,
    colorNeutralStrokeAccessibleSelected: brand[60],
    fontFamilyBase: FONT_FAMILY_BASE,
  };
};
