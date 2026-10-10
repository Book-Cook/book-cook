import { useRef, useState } from "react";
import { GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import styles from "./AppSidebar.module.css";
import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarItem } from "./SidebarItem";
import { Avatar } from "../Avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../Menu";

type AppSidebarProps = {
  forceExpanded?: boolean;
  onNewRecipe: () => void;
  onMenuOpenChange?: (open: boolean) => void;
};

export const AppSidebar = ({
  forceExpanded,
  onNewRecipe,
  onMenuOpenChange,
}: AppSidebarProps): React.ReactElement => {
  const { data: session } = useSession();
  const router = useRouter();

  const profileName = session?.user?.name ?? "Account";
  const profileImage = session?.user?.image ?? undefined;

  // The trigger is the whole sidebar row, so start-aligning the menu lines it
  // up with the row's padding edge. Shift it by the avatar's offset inside the
  // row (which differs between the expanded and collapsed sidebar) so the
  // menu starts where the avatar does.
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [avatarOffset, setAvatarOffset] = useState(0);

  // Radix hands focus back to the trigger on close, and the browser shows
  // the focus ring for it. Skip that when the menu was closed with the
  // pointer; keyboard closes still restore focus so keyboard users keep
  // their place.
  const closedWithPointerRef = useRef(false);

  const handleMenuOpenChange = (open: boolean): void => {
    const trigger = triggerRef.current;
    const avatar = trigger?.firstElementChild;
    if (open && trigger && avatar) {
      setAvatarOffset(
        avatar.getBoundingClientRect().left -
          trigger.getBoundingClientRect().left,
      );
    }
    onMenuOpenChange?.(open);
  };

  return (
    <Sidebar
      {...(forceExpanded ? { collapsed: false, showToggle: false } : {})}
    >
      <SidebarContent
        onNewRecipe={onNewRecipe}
        currentPath={router.pathname}
      />
      <div className={styles.profileFooter}>
        <Menu onOpenChange={handleMenuOpenChange}>
          <MenuTrigger asChild>
            <SidebarItem
              ref={triggerRef}
              icon={
                <Avatar name={profileName} imageURL={profileImage} size="sm" />
              }
              label={profileName}
            />
          </MenuTrigger>
          <MenuContent
            side="top"
            align="start"
            alignOffset={avatarOffset}
            onPointerDown={() => {
              closedWithPointerRef.current = true;
            }}
            onKeyDown={() => {
              closedWithPointerRef.current = false;
            }}
            onPointerDownOutside={() => {
              closedWithPointerRef.current = true;
            }}
            onCloseAutoFocus={(event) => {
              if (closedWithPointerRef.current) {
                event.preventDefault();
              }
              closedWithPointerRef.current = false;
            }}
          >
            <MenuItem
              className={styles.menuItem}
              startIcon={<GearSixIcon size={16} />}
              onSelect={() => router.push("/settings")}
            >
              Settings
            </MenuItem>
            <MenuItem
              className={styles.menuItem}
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
