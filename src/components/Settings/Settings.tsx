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
import type { AccordionToggleEventHandler } from "@fluentui/react-components";

const useStyles = makeStyles({
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "12px",
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase600,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    margin: "4px 0 0 0",
  },
  card: {
    ...shorthands.padding("24px"),
    ...shorthands.borderRadius("12px"),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
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
  const [visibleSectionIds, setVisibleSectionIds] = React.useState<Set<string>>(
    new Set()
  );
  const [openItems, setOpenItems] = React.useState<string[]>([]); // Add state for open accordion items

  const handleSearchChange = (
    _event: React.FormEvent<HTMLElement>,
    data: { value: string }
  ) => {
    setSearchTerm(data.value.toLowerCase());
  };

  const settingsContextValue = React.useMemo(
    () => ({
      searchTerm,
      addVisibleSection: (id: string) => {
        setVisibleSectionIds((prev) => new Set(prev).add(id));
      },
      removeVisibleSection: (id: string) => {
        setVisibleSectionIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
    }),
    [searchTerm]
  );

  const handleToggle: AccordionToggleEventHandler<string> = (_event, data) => {
    setOpenItems(data?.openItems);
  };

  const hasVisibleSections = !searchTerm || visibleSectionIds.size > 0;

  React.useEffect(() => {
    if (searchTerm) {
      setOpenItems(sectionIds.filter((id) => visibleSectionIds.has(id)));
    }
  }, [searchTerm, visibleSectionIds]);

  if (status === "loading") {
    return <Spinner label="Loading settings..." />;
  }

  if (!session) {
    return <Unauthorized />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your account and application preferences
          </p>
        </div>
        <SearchBox
          placeholder="Search settings"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <SettingsSearchContext.Provider value={settingsContextValue}>
          <Accordion
            collapsible
            openItems={openItems}
            defaultOpenItems={searchTerm ? sectionIds : []}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onToggle={handleToggle as any}
            multiple
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
