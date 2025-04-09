import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { tokens, Spinner, Accordion } from "@fluentui/react-components";
import { useSession } from "next-auth/react";
import { Unauthorized } from "../FallbackScreens";
import { AppearanceSection } from "./AppearanceSection/AppearanceSection";
// import { RecipePreferencesSection } from "../components/Settings/RecipePreferencesSection";
import { SharingSection } from "./SharingSection/SharingSection";
import { AccountSection } from "./AccountSection/AccountSection";

const useStyles = makeStyles({
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "24px",
  },
  card: {
    ...shorthands.padding("24px"),
    ...shorthands.borderRadius("12px"),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  accordionHeader: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
});

export const SettingsPage = () => {
  const styles = useStyles();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Spinner label="Loading settings..." />;
  }
  if (!session) {
    return <Unauthorized />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Accordion collapsible>
          <AppearanceSection />
          <SharingSection />
          <AccountSection />
        </Accordion>
        {/* <RecipePreferencesSection />
        <SharingSection />
          */}
      </div>
    </div>
  );
};
