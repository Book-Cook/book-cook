export interface UnifiedRecipeGalleryProps {
  initialTab?: "my-recipes" | "community";
  onTabChange?: (tab: "my-recipes" | "community") => void;
}

export type TabValue = "my-recipes" | "community";

export interface TabConfig {
  value: TabValue;
  label: string;
  ariaLabel: string;
}