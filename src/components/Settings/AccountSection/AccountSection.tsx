import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import {
  Button,
  tokens,
  Text,
  Avatar,
  Divider,
} from "@fluentui/react-components";
import { signOut, useSession } from "next-auth/react";
import { SettingsSection, SettingItem } from "../SettingShared";

const useStyles = makeStyles({
  profileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  email: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  dangerZone: {
    ...shorthands.borderRadius("8px"),
    ...shorthands.border("1px", "solid", tokens.colorPaletteRedBorder2),
    ...shorthands.padding("16px"),
    marginTop: "16px",
  },
  dangerTitle: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "8px",
  },
  dangerDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    marginBottom: "16px",
  },
  dangerButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundInverted,
    "&:hover": {
      backgroundColor: tokens.colorPaletteRedBackground3,
    },
    "&:active": {
      backgroundColor: tokens.colorPaletteRedBackground3,
    },
  },
});

export const AccountSection: React.FC = () => {
  const styles = useStyles();
  const { data: session } = useSession();
  const user = session?.user;

  const [isClearing, setIsClearing] = React.useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const clearRecents = async () => {
    if (
      !confirm("Are you sure you want to clear your recently viewed recipes?")
    ) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch("/api/recentlyViewed", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear recently viewed");
      }

      alert("Successfully cleared recently viewed recipes");
    } catch (error) {
      console.error(error);
      alert("Failed to clear recently viewed recipes");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <SettingsSection itemValue="account" title="Account">
      <SettingItem
        label="Profile Information"
        description="Your account details used for BookCook."
        showDivider
      >
        {user && (
          <div className={styles.profileInfo}>
            <Avatar
              name={user.name || undefined}
              image={{ src: user.image || undefined }}
              size={48}
              color="colorful"
            />
            <div className={styles.userDetails}>
              <Text weight="semibold">{user.name}</Text>
              <Text className={styles.email}>{user.email}</Text>
            </div>
          </div>
        )}
      </SettingItem>

      <SettingItem
        label="Sign Out"
        description="Log out of your BookCook account."
        showDivider
      >
        <Button onClick={handleSignOut}>Sign Out</Button>
      </SettingItem>

      <SettingItem
        label="Clear Recently Viewed"
        description="Remove all recipes from your recently viewed list."
      >
        <Button onClick={clearRecents} disabled={isClearing}>
          {isClearing ? "Clearing..." : "Clear Recently Viewed"}
        </Button>
      </SettingItem>

      <div className={styles.dangerZone}>
        <Text className={styles.dangerTitle}>Danger Zone</Text>
        <Text className={styles.dangerDescription}>
          These actions are destructive and cannot be reversed. Please proceed
          with caution.
        </Text>
        <Divider />
        <div style={{ marginTop: "16px" }}>
          <Button
            className={styles.dangerButton}
            onClick={() => alert("This feature is not yet implemented")}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};
