import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { useStyles } from "./UnifiedRecipeGallery.styles";
import type { UnifiedRecipeGalleryProps, TabValue, TabConfig } from "./UnifiedRecipeGallery.types";
import { Unauthorized } from "../FallbackScreens/Unathorized";
import { MyRecipesTab } from "./MyRecipesTab";
import { CommunityTab } from "./CommunityTab";

import { RecipeProvider } from "../../context";

const TAB_CONFIGS: TabConfig[] = [
  {
    value: "my-recipes",
    label: "My Recipes",
    ariaLabel: "View your personal recipes",
  },
  {
    value: "community", 
    label: "Community",
    ariaLabel: "Browse all public recipes",
  },
];

export const UnifiedRecipeGallery: React.FC<UnifiedRecipeGalleryProps> = ({
  initialTab = "my-recipes",
  onTabChange,
}) => {
  const styles = useStyles();
  const { data: session } = useSession();
  const router = useRouter();
  
  // Initialize tab from URL parameter or prop
  const [selectedTab, setSelectedTab] = React.useState<TabValue>(() => {
    if (typeof window !== "undefined") {
      const urlTab = router.query.tab as string;
      if (urlTab === "community" || urlTab === "my-recipes") {
        return urlTab;
      }
    }
    return initialTab;
  });

  // Update URL when tab changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const currentTab = router.query.tab as string;
      if (currentTab !== selectedTab) {
        const newQuery = { ...router.query };
        if (selectedTab === "my-recipes") {
          delete newQuery.tab; // Clean URL for default tab
        } else {
          newQuery.tab = selectedTab;
        }
        
        void router.replace(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [selectedTab, router]);

  const handleTabSelect = (tab: TabValue) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tab: TabValue) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabSelect(tab);
    }
  };

  if (!session) {
    return <Unauthorized />;
  }

  return (
    <RecipeProvider>
      <div className={styles.container}>
        <div className={`${styles.tabContainer} ${styles.tabContainerMobile}`}>
          <div
            className={`${styles.tabList} ${styles.tabListMobile}`}
            role="tablist"
            aria-label="Recipe gallery tabs"
          >
            {TAB_CONFIGS.map((config) => (
              <button
                key={config.value}
                role="tab"
                aria-selected={selectedTab === config.value}
                aria-label={config.ariaLabel}
                tabIndex={selectedTab === config.value ? 0 : -1}
                className={`${styles.tab} ${styles.tabMobile} ${
                  selectedTab === config.value ? styles.tabActive : ""
                }`}
                onClick={() => handleTabSelect(config.value)}
                onKeyDown={(e) => handleKeyDown(e, config.value)}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.tabContent}>
          <div
            role="tabpanel" 
            aria-labelledby="tab-my-recipes"
            className={styles.tabPanel}
            style={{ display: selectedTab === "my-recipes" ? "block" : "none" }}
          >
            <MyRecipesTab />
          </div>
          <div
            role="tabpanel"
            aria-labelledby="tab-community" 
            className={styles.tabPanel}
            style={{ display: selectedTab === "community" ? "block" : "none" }}
          >
            <CommunityTab />
          </div>
        </div>
      </div>
    </RecipeProvider>
  );
};