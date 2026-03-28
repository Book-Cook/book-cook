import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarItem } from "./SidebarItem";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "../Menu";
import { Avatar } from "../Avatar";
import { NewRecipeDialog } from "../NewRecipeDialog";
import { RecipeSearchFlyout } from "../RecipeSearchFlyout";
import { fetchRecentlyViewed } from "../../clientToServer/fetch/fetchRecentlyViewed";

import styles from "./AppSidebar.module.css";

export const AppSidebar = ({ forceExpanded }: { forceExpanded?: boolean }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isNewRecipeOpen, setIsNewRecipeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const profileName = session?.user?.name ?? "Account";
  const profileEmail = session?.user?.email ?? undefined;
  const profileImage = session?.user?.image ?? undefined;

  const { data: recentRecipes = [] } = useQuery({
    queryKey: ["recentlyViewed", profileEmail],
    queryFn: fetchRecentlyViewed,
    enabled: Boolean(session),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <Sidebar {...(forceExpanded ? { collapsed: false, showToggle: false } : {})}>
      <NewRecipeDialog
        open={isNewRecipeOpen}
        onOpenChange={setIsNewRecipeOpen}
      />
      <RecipeSearchFlyout
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        recentRecipes={recentRecipes}
      />
      <SidebarContent
        onNewRecipe={() => setIsNewRecipeOpen(true)}
        onSearch={() => setIsSearchOpen(true)}
        currentPath={router.pathname}
      />
      <div className={styles.profileFooter}>
        <Menu>
          <MenuTrigger asChild>
            <SidebarItem
              icon={<Avatar name={profileName} imageURL={profileImage} size="sm" />}
              label={profileName}
            />
          </MenuTrigger>
          <MenuContent side="top" align="end">
            <div className={styles.menuHeader}>
              <Avatar name={profileName} imageURL={profileImage} size="md" />
              <div className={styles.menuHeaderText}>
                <span className={styles.menuHeaderName}>{profileName}</span>
                {profileEmail && (
                  <span className={styles.menuHeaderMeta}>{profileEmail}</span>
                )}
              </div>
            </div>
            <MenuSeparator />
            <MenuItem startIcon={<GearSixIcon size={16} />} onSelect={() => router.push("/settings")}>Settings</MenuItem>
            <MenuItem
              startIcon={<SignOutIcon size={16} />}
              onSelect={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </Sidebar>
  );
};
