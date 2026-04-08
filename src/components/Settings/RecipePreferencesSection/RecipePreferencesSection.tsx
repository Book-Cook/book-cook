import * as React from "react";
import { ForkKnifeIcon } from "@phosphor-icons/react";

import styles from "./RecipePreferencesSection.module.css";
import { recipePreferencesSectionId } from "../constants";
import { useSettingsSection } from "../context";
import { SettingsSection, SettingItem } from "../SettingShared";

import {
  Dropdown,
  DropdownCaret,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "../../Dropdown";

const sectionKeywords = [
  "recipe",
  "preferences",
  "cooking",
  "food",
  "settings",
];
const measurementKeywords = [
  "default measurement system",
  "measurement",
  "system",
  "metric",
  "imperial",
  "us",
  "customary",
  "units",
];
const servingsKeywords = [
  "default servings",
  "servings",
  "portions",
  "size",
  "people",
  "yield",
  "default servings",
];
const conversionKeywords = [
  "convert",
  "auto-convert measurements",
  "auto convert measurements",
  "auto",
  "automatic",
  "measurement conversion",
  "toggle",
];

export const RecipePreferencesSection: React.FC = () => {
  const [defaultServings, setDefaultServings] = React.useState(4);
  const [measurementUnit, setMeasurementUnit] = React.useState("us");
  const [enableAutoConvert, setEnableAutoConvert] = React.useState(true);

  const { isVisible, searchTerm } = useSettingsSection(
    recipePreferencesSectionId,
    [
      ...sectionKeywords,
      ...measurementKeywords,
      ...servingsKeywords,
      ...conversionKeywords,
    ],
  );

  const sectionMatches =
    !searchTerm || sectionKeywords.some((k) => k.includes(searchTerm));
  const measurementItemMatches =
    !searchTerm || measurementKeywords.some((k) => k.includes(searchTerm));
  const servingsItemMatches =
    !searchTerm || servingsKeywords.some((k) => k.includes(searchTerm));
  const conversionItemMatches =
    !searchTerm || conversionKeywords.some((k) => k.includes(searchTerm));

  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Recipe Preferences"
      itemValue={recipePreferencesSectionId}
      icon={<ForkKnifeIcon />}
    >
      {(!searchTerm || measurementItemMatches || sectionMatches) && (
        <SettingItem
          label="Default Measurement System"
          description="Choose your preferred measurement system for recipes."
        >
          <Dropdown
            value={measurementUnit}
            onValueChange={(val) => setMeasurementUnit(val)}
          >
            <DropdownTrigger fullWidth className={styles.dropdown}>
              <DropdownValue />
              <DropdownCaret />
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem value="us">
                US Customary (cups, ounces)
              </DropdownItem>
              <DropdownItem value="metric">
                Metric (grams, milliliters)
              </DropdownItem>
              <DropdownItem value="both">Show Both</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </SettingItem>
      )}

      {(!searchTerm || servingsItemMatches || sectionMatches) && (
        <SettingItem
          label="Default Servings"
          description="Set the default number of servings for new recipes."
        >
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={defaultServings}
            onChange={(e) => setDefaultServings(Number(e.target.value))}
            aria-label="Default servings"
          />
        </SettingItem>
      )}

      {(!searchTerm || conversionItemMatches || sectionMatches) && (
        <SettingItem
          label="Auto-Convert Measurements"
          description="Automatically convert measurements between systems when viewing recipes."
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={enableAutoConvert}
              onChange={(e) => setEnableAutoConvert(e.target.checked)}
            />
            {enableAutoConvert ? "Enabled" : "Disabled"}
          </label>
        </SettingItem>
      )}
    </SettingsSection>
  );
};
