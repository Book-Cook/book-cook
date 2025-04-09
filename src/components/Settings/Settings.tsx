import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import {
  tokens,
  Spinner,
  Accordion,
  SearchBox,
} from "@fluentui/react-components";
import { useSession } from "next-auth/react";
import { Unauthorized } from "../FallbackScreens";
import { AppearanceSection } from "./AppearanceSection/AppearanceSection";
import { SharingSection } from "./SharingSection/SharingSection";
import { AccountSection } from "./AccountSection/AccountSection";
import { RecipePreferencesSection } from "./RecipePreferencesSection/RecipePreferencesSection";
import { SettingsSearchContext } from "./context";
import { sectionIds } from "./constants";

const useStyles = makeStyles({
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "12px",
  },
  card: {
    ...shorthands.padding("24px"),
    ...shorthands.borderRadius("12px"),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    justifyContent: "center",
  },
  accordionHeader: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  noResults: {
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    padding: "16px",
    fontStyle: "italic",
  },
});

export const SettingsPage = () => {
  const styles = useStyles();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleSections, setVisibleSections] = React.useState<string[]>([]);

  const handleSearchChange = (
    _event: React.FormEvent<HTMLElement>,
    data: { value: string }
  ) => {
    setSearchTerm(data.value.toLowerCase());
  };

  const settingsContextValue = React.useMemo(
    () => ({
      searchTerm,
      registerVisibleSection: (sectionId: string) => {
        setVisibleSections((prev) =>
          prev.includes(sectionId) ? prev : [...prev, sectionId]
        );
      },
      unregisterVisibleSection: (sectionId: string) => {
        setVisibleSections((prev) => prev.filter((id) => id !== sectionId));
      },
    }),
    [searchTerm]
  );

  if (status === "loading") {
    return <Spinner label="Loading settings..." />;
  }
  if (!session) {
    return <Unauthorized />;
  }

  const hasVisibleSections = !searchTerm || visibleSections.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <SearchBox
          placeholder="Search settings"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <SettingsSearchContext.Provider value={settingsContextValue}>
          <Accordion
            collapsible
            defaultOpenItems={searchTerm ? sectionIds : []}
          >
            <AppearanceSection />
            <RecipePreferencesSection />
            <SharingSection />
            <AccountSection />
          </Accordion>

          {searchTerm && !hasVisibleSections && (
            <div className={styles.noResults}>No matching settings found</div>
          )}
        </SettingsSearchContext.Provider>
      </div>
    </div>
  );
};
