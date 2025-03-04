import * as React from "react";
import {
  FluentProvider,
  createDarkTheme,
  createLightTheme,
  Theme,
  BrandVariants,
} from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import { Toolbar } from "./";
import { SearchBoxProvider } from "../context";

// Create a lavender-inspired brand palette
const appBrandVariants: BrandVariants = {
  10: "#f9f5ff",
  20: "#f2ebff",
  30: "#e7ddff", // Your requested lavender color
  40: "#d3c3fa",
  50: "#bea8f5",
  60: "#a98df0", // Primary brand color
  70: "#9272e6",
  80: "#7d5adc",
  90: "#6943d1",
  100: "#572dc7",
  110: "#481dbd",
  120: "#3a12a9",
  130: "#2d0a95",
  140: "#210681",
  150: "#15036d",
  160: "#0c0259",
};

// Create custom theme with our lavender brand variants
const customLightTheme = {
  ...createLightTheme(appBrandVariants),

  // Brand colors
  colorBrandForeground1: appBrandVariants[60],
  colorBrandForeground2: appBrandVariants[80],
  colorBrandBackground: appBrandVariants[60],
  colorBrandBackgroundHover: appBrandVariants[70],
  colorBrandBackgroundPressed: appBrandVariants[80],
  colorBrandStroke1: appBrandVariants[60],
  colorBrandStroke2: appBrandVariants[70],

  // Neutral backgrounds
  colorNeutralBackground1: "#fcfaff", // Very soft lavender-white
  colorNeutralBackground2: "#ffffff",
  colorNeutralBackground3: "#f5f0ff", // Subtle lavender for backgrounds
  colorNeutralBackground4: "#f1ebfc",
  colorNeutralBackground5: "#eae0ff",
  colorNeutralBackground6: "#e7ddff",
  colorNeutralBackgroundDisabled: "#f5f0ff",
  colorNeutralBackgroundInverted: "#3b2f5b",

  // Neutral foregrounds
  colorNeutralForeground1: "#3b2f5b", // Deep purple-blue for text (high contrast)
  colorNeutralForeground2: "#574a77", // Medium purple-gray
  colorNeutralForeground3: "#7c6f9c", // Lighter purple-gray
  colorNeutralForeground4: "#9c92b7", // Even lighter
  colorNeutralForegroundDisabled: "#b0a8c8",
  colorNeutralForegroundOnBrand: "#ffffff",

  // Neutral strokes
  colorNeutralStroke1: "#d7cfeb", // Light purple for borders
  colorNeutralStroke2: "#e7ddff", // Your lavender for subtle borders
  colorNeutralStroke3: "#ede6ff",
  colorNeutralStrokeAccessible: "#6943d1", // Accessible border color
  colorNeutralStrokeDisabled: "#e7ddff",
  colorNeutralStrokeOnBrand: "#ffffff",

  // Subtle backgrounds
  colorSubtleBackground: "#f5f0ff",
  colorSubtleBackgroundHover: "#ede6ff",
  colorSubtleBackgroundPressed: "#e7ddff",
  colorSubtleBackgroundSelected: "#d3c3fa",

  // Status colors
  colorStatusForegroundSuccess: "#2e8540",
  colorStatusForegroundInfo: "#0078d4",
  colorStatusForegroundWarning: "#b35900",
  colorStatusForegroundError: "#d13438",

  colorStatusBackground1Success: "#dff6dd",
  colorStatusBackground1Info: "#e5f1fb",
  colorStatusBackground1Warning: "#fff4ce",
  colorStatusBackground1Error: "#fde7e9",

  colorStatusBackground2Success: "#7ecb7e",
  colorStatusBackground2Info: "#77c5d5",
  colorStatusBackground2Warning: "#fac06f",
  colorStatusBackground2Error: "#e07985",

  colorStatusBackground3Success: "#5cb85c",
  colorStatusBackground3Info: "#0078d4",
  colorStatusBackground3Warning: "#ff8c00",
  colorStatusBackground3Error: "#d13438",
};

const fluentProviderStyles = {
  height: "100%",
  backgroundColor: customLightTheme.colorNeutralBackground1,
  fontFamily: `"Nunito", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`,
};

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");

  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <FluentProvider theme={customLightTheme} style={fluentProviderStyles}>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <Toolbar />
        <main style={{ padding: "24px" }}>{children}</main>
      </SearchBoxProvider>
    </FluentProvider>
  );
};
