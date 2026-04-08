import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";

import { AccountSection } from "./AccountSection";
import { AppearanceSection } from "./AppearanceSection";
import { RecipePreferencesSection } from "./RecipePreferencesSection";
import styles from "./Settings.module.css";
import { SharingSection } from "./SharingSection";

/* ── Page ───────────────────────────────────────────────── */

export const SettingsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>
          Manage your account and application preferences
        </p>
      </div>
      <Accordion.Root
        type="multiple"
        defaultValue={[
          "appearance",
          "recipe-preferences",
          "sharing",
          "account",
        ]}
        className={styles.accordion}
      >
        <AppearanceSection />
        <RecipePreferencesSection />
        <SharingSection />
        <AccountSection />
      </Accordion.Root>
    </div>
  );
};
