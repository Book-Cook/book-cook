import * as React from "react";
import { PaintBrushIcon } from "@phosphor-icons/react";

import { Section, SettingItem } from "./Settings.helpers";
import styles from "./Settings.module.css";
import { useTheme } from "../Theme/ThemeProvider";

export function AppearanceSection(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <Section
      value="appearance"
      title="Appearance"
      icon={<PaintBrushIcon size={18} />}
    >
      <SettingItem label="Theme" description="Choose the application theme.">
        <div className={styles.radioGroup}>
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.radioBtn} ${theme === t ? styles.radioBtnActive : ""}`}
              onClick={() => setTheme?.(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </SettingItem>
    </Section>
  );
}
