import * as React from "react";
import { makeStyles } from "@griffel/react";
import type {
  SelectionEvents} from "@fluentui/react-components";
import {
  Dropdown,
  Option,
  Switch,
  Slider
} from "@fluentui/react-components";
import { Food24Regular } from "@fluentui/react-icons";
import { SettingsSection, SettingItem } from "../SettingShared";
import { recipePreferencesSectionId } from "../constants";
import { useSettingsSection } from "../context";

const useStyles = makeStyles({
  dropdown: {
    width: "100%",
  },
});

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
  const styles = useStyles();
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
    ]
  );

  const sectionMatches =
    !searchTerm || sectionKeywords.some((k) => k.includes(searchTerm));
  const measurementItemMatches =
    !searchTerm || measurementKeywords.some((k) => k.includes(searchTerm));
  const servingsItemMatches =
    !searchTerm || servingsKeywords.some((k) => k.includes(searchTerm));
  const conversionItemMatches =
    !searchTerm || conversionKeywords.some((k) => k.includes(searchTerm));

  const handleMeasurementChange = (
    _ev: SelectionEvents,
    data: { selectedOptions: string[] }
  ) => {
    if (data.selectedOptions.length > 0) {
      setMeasurementUnit(data.selectedOptions[0]);
    }
  };

  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Recipe Preferences"
      itemValue={recipePreferencesSectionId}
      icon={<Food24Regular />}
    >
      {(!searchTerm || measurementItemMatches || sectionMatches) && (
        <SettingItem
          label="Default Measurement System"
          description="Choose your preferred measurement system for recipes."
        >
          <Dropdown
            className={styles.dropdown}
            selectedOptions={[measurementUnit]}
            onOptionSelect={handleMeasurementChange}
          >
            <Option value="us">US Customary (cups, ounces)</Option>
            <Option value="metric">Metric (grams, milliliters)</Option>
            <Option value="both">Show Both</Option>
          </Dropdown>
        </SettingItem>
      )}

      {(!searchTerm || servingsItemMatches || sectionMatches) && (
        <SettingItem
          label="Default Servings"
          description="Set the default number of servings for new recipes."
        >
          <Slider
            min={1}
            max={12}
            step={1}
            value={defaultServings}
            onChange={(_, data) => setDefaultServings(data.value)}
          />
        </SettingItem>
      )}

      {(!searchTerm || conversionItemMatches || sectionMatches) && (
        <SettingItem
          label="Auto-Convert Measurements"
          description="Automatically convert measurements between systems when viewing recipes."
        >
          <Switch
            checked={enableAutoConvert}
            onChange={(_, data) => setEnableAutoConvert(data.checked)}
          />
        </SettingItem>
      )}
    </SettingsSection>
  );
};
