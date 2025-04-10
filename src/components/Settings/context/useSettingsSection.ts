import * as React from "react";

import { useSettingsSearch } from ".";

/**
 * Hook for managing settings section visibility during search
 */
export function useSettingsSection(sectionId: string, keywords: string[]) {
  const { searchTerm, addVisibleSection, removeVisibleSection } =
    useSettingsSearch();

  // Check if this section matches the search
  const isVisible = React.useMemo(() => {
    if (!searchTerm) {
      return true;
    }

    // Join all keywords and check if they include the search term
    return keywords.some((keyword) =>
      keyword.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, keywords]);

  // Register/unregister visibility
  React.useEffect(() => {
    if (!searchTerm) {
      return;
    }

    if (isVisible) {
      addVisibleSection(sectionId);
    }

    return () => {
      if (searchTerm) {
        removeVisibleSection(sectionId);
      }
    };
  }, [
    searchTerm,
    isVisible,
    sectionId,
    addVisibleSection,
    removeVisibleSection,
  ]);

  return { isVisible, searchTerm };
}
