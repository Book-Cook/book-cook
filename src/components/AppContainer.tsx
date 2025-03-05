import * as React from "react";
import {
  FluentProvider,
  createDarkTheme,
  createLightTheme,
  webLightTheme,
  BrandVariants,
} from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import { Toolbar } from "./";
import { SearchBoxProvider } from "../context";

// Create a lavender-inspired brand palette
const appBrandVariants: BrandVariants = {
  10: "#f8f5ff",
  20: "#ede3ff",
  30: "#e1d7ff",
  40: "#cec1fa",
  50: "#b9aaf5",
  60: "#8a79e3",
  70: "#8775e3",
  80: "#6f5ed9",
  90: "#5847cf",
  100: "#4a3cc0",
  110: "#3d30b3",
  120: "#301ea2",
  130: "#24128e",
  140: "#1a0a7a",
  150: "#110366",
  160: "#080159",
};

// Create custom theme with our lavender brand variants
const customLightTheme: Theme = {
  ...createLightTheme(appBrandVariants),

  // Brand foreground colors
  colorBrandForeground1: appBrandVariants[60],
  colorBrandForeground2: appBrandVariants[80],

  // Brand background colors - add the numbered versions
  colorBrandBackground: appBrandVariants[60],
  colorBrandBackground2: appBrandVariants[40],
  colorBrandBackgroundHover: appBrandVariants[70],
  colorBrandBackgroundPressed: appBrandVariants[80],
  colorBrandBackgroundSelected: appBrandVariants[60],

  // Brand stroke colors
  colorBrandStroke1: appBrandVariants[60],
  colorBrandStroke2: appBrandVariants[70],

  // Compound brand colors - important for interactive elements
  colorCompoundBrandForeground1: appBrandVariants[60],
  colorCompoundBrandForeground1Hover: appBrandVariants[70],
  colorCompoundBrandForeground1Pressed: appBrandVariants[80],

  // Neutral backgrounds
  colorNeutralBackground1: "#FCFAFF",
  colorNeutralBackground1Hover: "#f8f8f9", // Very subtle gray hover
  colorNeutralBackground2Hover: "#f5f5f6", // Subtle gray hover for white surfaces
  colorNeutralBackground3Hover: "#f0f0f2", // Slightly deeper neutral hover
  colorNeutralBackground1Pressed: "#f0f0f2", // Neutral pressed state
  colorNeutralBackground2Pressed: "#f2f2f4", // Subtle pressed state for white surfaces
  colorNeutralBackground3Pressed: "#e8e8ec", // Deeper neutral pressed state
  colorNeutralBackground1Selected: "#e8e8ec", // Neutral selected state
  colorNeutralBackground2Selected: "#ececf0", // Subtle selected state
  colorNeutralBackground3Selected: "#e0e0e4", // Deeper neutral selected state

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
  colorSubtleBackground: "#f5f5f7",
  colorSubtleBackgroundHover: "#ececf0",
  colorSubtleBackgroundPressed: "#e5e5e9",
  colorSubtleBackgroundSelected: "#dedee2",
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
