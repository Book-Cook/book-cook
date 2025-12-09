import * as React from "react";
import { Avatar, Tooltip, Menu, MenuItem, MenuTrigger, MenuPopover, MenuList, MenuDivider, Button, Spinner } from "@fluentui/react-components";
import { Settings24Regular, SignOut24Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import { Text } from "../../Text";

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
          <div
            style={{
              padding: "8px 16px",
              borderBottom: "1px solid var(--colorNeutralStroke1)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div>
              <Text weight="semibold">{userName}</Text>
              <Text size={200} style={{ display: "block", opacity: 0.8 }}>
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
