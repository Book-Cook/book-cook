import * as React from "react";
import { Avatar, Tooltip, Menu, MenuItem, MenuTrigger, MenuPopover, MenuList, MenuDivider, Button } from "@fluentui/react-components";
import { Settings24Regular, SignOut24Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import styles from "./UserProfile.module.css";

import { Text } from "../../Text";
import { Spinner } from "../../Spinner";

export const UserProfile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userName = session?.user?.name ?? session?.user?.email ?? "Unknown";
  const userImage = session?.user?.image ?? undefined;

  if (status === "loading") {
    return <Spinner size="tiny" />;
  }

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Tooltip content="Account options" relationship="label">
          <Button
            appearance="subtle"
            shape="circular"
            icon={
              <Avatar
                name={userName}
                image={{ src: userImage }}
                size={36}
                color="colorful"
              />
            }
            aria-label="Account menu"
          />
        </Tooltip>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <div className={styles.header}>
            <div>
              <Text weight="semibold">{userName}</Text>
              <Text size={200} className={styles.email}>
                {session?.user?.email}
              </Text>
            </div>
          </div>

          <MenuItem
            icon={<Settings24Regular />}
            onClick={() => router?.push("/settings")}
          >
            Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<SignOut24Regular />} onClick={() => signOut()}>
            Sign Out
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
