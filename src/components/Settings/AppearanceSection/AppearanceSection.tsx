import * as React from "react";
import { makeStyles } from "@griffel/react";
import { Input, Radio, RadioGroup } from "@fluentui/react-components";
import { PaintBrush24Regular } from "@fluentui/react-icons";
import { useTheme } from "../../../context";
import { SettingsSection, SettingItem } from "../SettingShared";
import type { ThemePreference } from "../../../context";
import { useSettingsSearch } from "../context";
import { appearanceSectionId } from "../constants";

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
  const { searchTerm, registerVisibleSection, unregisterVisibleSection } =
    useSettingsSearch();
  const sectionId = "appearance";

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleThemePreferenceChange = (
    _: React.FormEvent<HTMLDivElement>,
    data: { value: string }
  ) => {
    setThemePreference(data.value as ThemePreference);
  };

  // Check if this section or any of its items match the search term
  const sectionMatches =
    !searchTerm || "appearance theme color".includes(searchTerm);
  const themeItemMatches =
    !searchTerm || "theme light dark system".includes(searchTerm);
  const colorItemMatches =
    !searchTerm || "primary color accent".includes(searchTerm);

  // Determine if section should be visible
  const isVisible =
    !searchTerm || sectionMatches || themeItemMatches || colorItemMatches;

  // Register/unregister section visibility when it changes
  React.useEffect(() => {
    if (searchTerm) {
      if (isVisible) {
        registerVisibleSection(sectionId);
      } else {
        unregisterVisibleSection(sectionId);
      }
    }

    // Cleanup on unmount
    return () => {
      if (searchTerm) {
        unregisterVisibleSection(sectionId);
      }
    };
  }, [
    searchTerm,
    isVisible,
    registerVisibleSection,
    unregisterVisibleSection,
    sectionId,
  ]);

  // If there's a search term and nothing in this section matches, don't render
  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Appearance"
      itemValue={appearanceSectionId}
      icon={<PaintBrush24Regular />}
    >
      {(!searchTerm || themeItemMatches) && (
        <SettingItem
          label="Theme"
          description="Choose the application theme or follow system preference."
          showDivider={!searchTerm || colorItemMatches}
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
      {(!searchTerm || colorItemMatches) && (
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
