import { GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import styles from "./AppSidebar.module.css";
import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarItem } from "./SidebarItem";
import { Avatar } from "../Avatar";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "../Menu";

type AppSidebarProps = {
  forceExpanded?: boolean;
  onNewRecipe: () => void;
  onSearch: () => void;
  onMenuOpenChange?: (open: boolean) => void;
};

export const AppSidebar = ({ forceExpanded, onNewRecipe, onSearch, onMenuOpenChange }: AppSidebarProps): React.ReactElement => {
  const { data: session } = useSession();
  const router = useRouter();

  const profileName = session?.user?.name ?? "Account";
  const profileEmail = session?.user?.email ?? undefined;
  const profileImage = session?.user?.image ?? undefined;

  return (
    <Sidebar {...(forceExpanded ? { collapsed: false, showToggle: false } : {})}>
      <SidebarContent
        onNewRecipe={onNewRecipe}
        onSearch={onSearch}
        currentPath={router.pathname}
      />
      <div className={styles.profileFooter}>
        <Menu onOpenChange={onMenuOpenChange}>
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
