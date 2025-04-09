import * as React from "react";

interface SettingsSearchContextType {
  searchTerm: string;
  registerVisibleSection: (sectionId: string) => void;
  unregisterVisibleSection: (sectionId: string) => void;
}

export const SettingsSearchContext =
  React.createContext<SettingsSearchContextType>({
    searchTerm: "",
    registerVisibleSection: () => {},
    unregisterVisibleSection: () => {},
  });

export const useSettingsSearch = () => React.useContext(SettingsSearchContext);
