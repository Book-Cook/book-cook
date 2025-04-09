import * as React from "react";
import { makeStyles } from "@griffel/react";
import { Input, Radio, RadioGroup } from "@fluentui/react-components";
import { useTheme } from "../../../context";
import { SettingsSection, SettingItem } from "../SettingShared";
import type { ThemePreference } from "../../../context";

const useStyles = makeStyles({
  colorInput: {
    height: "32px",
    minWidth: "40px",
    cursor: "pointer",
  },
});

export const AppearanceSection: React.FC = () => {
  const styles = useStyles();
  const { themePreference, setThemePreference, primaryColor, setPrimaryColor } =
    useTheme();

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleThemePreferenceChange = (
    _: React.FormEvent<HTMLDivElement>,
    data: { value: string }
  ) => {
    setThemePreference(data.value as ThemePreference);
  };

  return (
    <SettingsSection title="Appearance" itemValue="appearance">
      <SettingItem
        label="Theme"
        description="Choose the application theme or follow system preference."
        showDivider
      >
        <RadioGroup
          layout="horizontal"
          value={themePreference}
          onChange={handleThemePreferenceChange}
        >
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
          <Radio value="system" label="System" />
        </RadioGroup>
      </SettingItem>
      <SettingItem
        label="Primary Color"
        description="Choose the main accent color used throughout the app."
      >
        <Input
          className={styles.colorInput}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type={"color" as any}
          value={primaryColor}
          onChange={handlePrimaryColorChange}
          appearance="filled-darker"
          aria-label="Select primary color"
        />
      </SettingItem>
    </SettingsSection>
  );
};
