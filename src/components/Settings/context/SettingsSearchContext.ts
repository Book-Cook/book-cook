import * as React from "react";

interface SettingsSearchContextType {
  searchTerm: string;
  addVisibleSection: (id: string) => void;
  removeVisibleSection: (id: string) => void;
}

export const SettingsSearchContext =
  React.createContext<SettingsSearchContextType>({
    searchTerm: "",
    addVisibleSection: () => {},
    removeVisibleSection: () => {},
  });

export const useSettingsSearch = () => React.useContext(SettingsSearchContext);
