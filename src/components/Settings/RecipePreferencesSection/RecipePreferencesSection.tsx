import * as React from "react";
import { makeStyles } from "@griffel/react";
import {
  Dropdown,
  Option,
  Switch,
  Slider,
  SelectionEvents,
} from "@fluentui/react-components";
import { Food24Regular } from "@fluentui/react-icons";
import { SettingsSection, SettingItem } from "../SettingShared";
import { recipePreferencesSectionId } from "../constants";

const useStyles = makeStyles({
  dropdown: {
    width: "100%",
  },
});

export const RecipePreferencesSection: React.FC = () => {
  const styles = useStyles();
  const [defaultServings, setDefaultServings] = React.useState(4);
  const [measurementUnit, setMeasurementUnit] = React.useState("us");
  const [enableAutoConvert, setEnableAutoConvert] = React.useState(true);

  const handleMeasurementChange = (
    _ev: SelectionEvents,
    data: { selectedOptions: string[] }
  ) => {
    if (data.selectedOptions.length > 0) {
      setMeasurementUnit(data.selectedOptions[0]);
    }
  };

  return (
    <SettingsSection
      title="Recipe Preferences"
      itemValue={recipePreferencesSectionId}
      icon={<Food24Regular />}
    >
      <SettingItem
        label="Default Measurement System"
        description="Choose your preferred measurement system for recipes."
        showDivider
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

      <SettingItem
        label="Default Servings"
        description="Set the default number of servings for new recipes."
        showDivider
      >
        <Slider
          min={1}
          max={12}
          step={1}
          value={defaultServings}
          onChange={(_, data) => setDefaultServings(data.value)}
        />
      </SettingItem>
      <SettingItem
        label="Auto-Convert Measurements"
        description="Automatically convert measurements between systems when viewing recipes."
      >
        <Switch
          checked={enableAutoConvert}
          onChange={(_, data) => setEnableAutoConvert(data.checked)}
        />
      </SettingItem>
    </SettingsSection>
  );
};
