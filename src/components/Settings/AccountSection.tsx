import * as React from "react";
import { UserIcon } from "@phosphor-icons/react";
import { useSession, signOut } from "next-auth/react";

import { Section, SettingItem } from "./Settings.helpers";
import styles from "./Settings.module.css";
import { Avatar } from "../Avatar";

export function AccountSection(): React.ReactElement {
  const { data: session } = useSession();
  const user = session?.user;
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearRecents = async () => {
    if (!confirm("Clear your recently viewed recipes?")) {
      return;
    }
    setIsClearing(true);
    try {
      await fetch("/api/recentlyViewed", { method: "DELETE" });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Section value="account" title="Account" icon={<UserIcon size={18} />}>
      <SettingItem label="Profile" description="Your account details.">
        {user && (
          <div className={styles.profileRow}>
            <Avatar
              name={user.name ?? "Account"}
              imageURL={user.image ?? undefined}
              size="sm"
            />
            <div className={styles.profileDetails}>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
            </div>
          </div>
        )}
      </SettingItem>
      <SettingItem
        label="Recently Viewed"
        description="Remove all recipes from your recently viewed list."
      >
        <button
          className={styles.btn}
          onClick={handleClearRecents}
          disabled={isClearing}
        >
          {isClearing ? "Clearing…" : "Clear History"}
        </button>
      </SettingItem>
      <SettingItem
        label="Sign Out"
        description="Log out of your Book Cook account."
      >
        <button
          className={styles.btn}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </button>
      </SettingItem>
      <SettingItem label="Danger Zone" description="">
        <div className={styles.dangerZone}>
          <p className={styles.dangerTitle}>Delete Account</p>
          <p className={styles.dangerDescription}>
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => alert("Account deletion is not yet available.")}
          >
            Delete Account
          </button>
        </div>
      </SettingItem>
    </Section>
  );
}
