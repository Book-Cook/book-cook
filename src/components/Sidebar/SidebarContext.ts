import { createContext, useContext } from "react";

export type SidebarContextValue = {
  collapsed: boolean;
  getSectionOpen: (id: string) => boolean | undefined;
  setSectionOpen: (id: string, open: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  getSectionOpen: () => undefined,
  setSectionOpen: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);
