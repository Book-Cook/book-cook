import * as React from "react";
import { makeStyles } from "@griffel/react";
import { Input, Radio, RadioGroup } from "@fluentui/react-components";
import { PaintBrush24Regular } from "@fluentui/react-icons";
import { useTheme } from "../../../context";
import { SettingsSection, SettingItem } from "../SettingShared";
import type { ThemePreference } from "../../../context";
import { appearanceSectionId } from "../constants";
import { useSettingsSection } from "../context";

const useStyles = makeStyles({
  colorInput: {
    height: "32px",
    minWidth: "40px",
    cursor: "pointer",
  },
});

const sectionKeywords = ["appearance", "look", "visual", "design"];
const themeKeyWords = ["theme", "light", "dark", "system", "mode"];
const colorKeyWords = ["primary", "color", "accent", "brand"];

export const AppearanceSection: React.FC = () => {
  const styles = useStyles();
  const { themePreference, setThemePreference, primaryColor, setPrimaryColor } =
    useTheme();

  const { isVisible, searchTerm } = useSettingsSection(appearanceSectionId, [
    ...sectionKeywords,
    ...themeKeyWords,
    ...colorKeyWords,
  ]);

  const sectionMatches =
    !searchTerm || sectionKeywords.some((k) => k.includes(searchTerm));
  const themeItemMatches =
    !searchTerm || themeKeyWords.some((k) => k.includes(searchTerm));
  const colorItemMatches =
    !searchTerm || colorKeyWords.some((k) => k.includes(searchTerm));

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleThemePreferenceChange = (
    _: React.FormEvent<HTMLDivElement>,
    data: { value: string }
  ) => {
    setThemePreference(data.value as ThemePreference);
  };

  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Appearance"
      itemValue={appearanceSectionId}
      icon={<PaintBrush24Regular />}
    >
      {(!searchTerm || themeItemMatches || sectionMatches) && (
        <SettingItem
          label="Theme"
          description="Choose the application theme or follow system preference."
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
      )}
      {(!searchTerm || colorItemMatches || sectionMatches) && (
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
      )}
    </SettingsSection>
  );
};
