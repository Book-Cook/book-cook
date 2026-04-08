import * as React from "react";
import { ForkKnifeIcon } from "@phosphor-icons/react";

import { Section, SettingItem } from "./Settings.helpers";
import styles from "./Settings.module.css";

export function RecipePreferencesSection(): React.ReactElement {
  const [defaultServings, setDefaultServings] = React.useState(4);
  const [measurementUnit, setMeasurementUnit] = React.useState("us");

  return (
    <Section
      value="recipe-preferences"
      title="Recipe Preferences"
      icon={<ForkKnifeIcon size={18} />}
    >
      <SettingItem
        label="Default Measurement System"
        description="Choose your preferred measurement system for recipes."
      >
        <select
          className={styles.select}
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
        >
          <option value="us">US Customary (cups, oz)</option>
          <option value="metric">Metric (g, ml)</option>
          <option value="both">Show Both</option>
        </select>
      </SettingItem>
      <SettingItem
        label="Default Servings"
        description="Default number of servings for new recipes."
      >
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={defaultServings}
            onChange={(e) => setDefaultServings(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderValue}>{defaultServings}</span>
        </div>
      </SettingItem>
    </Section>
  );
}
