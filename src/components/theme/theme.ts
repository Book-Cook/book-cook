import chroma from "chroma-js";

export type ThemeMode = "light" | "dark";

export type BrandVariants = Record<
  10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160,
  string
>;

// --- Configuration ---
const NEUTRAL_SATURATION_LIGHT = 0.05;
const NEUTRAL_SATURATION_DARK = 0.1;
const PRIMARY_BRAND_SHADE_INDEX: keyof BrandVariants = 80;
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

/**
 * Applies brand and neutral CSS variables to document.documentElement
 * based on the primary color and theme mode.
 */
export const applyBrandTheme = (primaryColor: string, mode: ThemeMode): void => {
  const brand = generateBrandVariants(primaryColor);
  const root = document.documentElement;

  if (mode === "light") {
    root.style.setProperty("--brand-Primary", brand[80]);
    root.style.setProperty("--brand-Hover", brand[70]);
    root.style.setProperty("--brand-Pressed", brand[60]);

    const brandHue = chroma(brand[PRIMARY_BRAND_SHADE_INDEX]).get("hsl.h");
    const get = (l: number) =>
      chroma.hsl(brandHue, NEUTRAL_SATURATION_LIGHT, l).hex();

    root.style.setProperty("--ui-Canvas", get(0.98));
    root.style.setProperty("--ui-PageBackground", "#ffffff");
    root.style.setProperty("--ui-ControlHover", get(0.96));
    root.style.setProperty("--ui-ControlPressed", get(0.95));
    root.style.setProperty("--ui-ControlBorderHover", get(0.65));
    root.style.setProperty("--ui-ControlDisabled", get(0.65));
    root.style.setProperty("--ui-Divider", get(0.8));
    root.style.setProperty("--ui-TextPrimary", get(0.2));
    root.style.setProperty("--ui-TextSecondary", get(0.35));
    root.style.setProperty("--ui-TextLabel", get(0.5));
  } else {
    root.style.setProperty("--brand-Primary", brand[80]);
    root.style.setProperty("--brand-Hover", brand[60]);
    root.style.setProperty("--brand-Pressed", brand[50]);

    const brandHue = chroma(brand[PRIMARY_BRAND_SHADE_INDEX]).get("hsl.h");
    const get = (l: number) =>
      chroma.hsl(brandHue, NEUTRAL_SATURATION_DARK, l).hex();

    root.style.setProperty("--ui-Canvas", get(0.12));
    root.style.setProperty("--ui-PageBackground", get(0.08));
    root.style.setProperty("--ui-ControlHover", get(0.18));
    root.style.setProperty("--ui-ControlPressed", get(0.16));
    root.style.setProperty("--ui-ControlBorderHover", get(0.75));
    root.style.setProperty("--ui-ControlDisabled", get(0.45));
    root.style.setProperty("--ui-Divider", get(0.35));
    root.style.setProperty("--ui-TextPrimary", get(0.95));
    root.style.setProperty("--ui-TextSecondary", get(0.85));
    root.style.setProperty("--ui-TextLabel", get(0.7));
  }
};
