import * as React from "react";
import { UsersIcon } from "@phosphor-icons/react";

import { Section, SettingItem } from "./Settings.helpers";
import styles from "./Settings.module.css";
import { Avatar } from "../Avatar";

import { useDeleteSharedUser } from "../../clientToServer/delete/useDeleteSharedUser";
import { useSharedUsers } from "../../clientToServer/fetch/useSharedUsers";
import { useShareWithUser } from "../../clientToServer/post/useShareWithUser";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SharingSection(): React.ReactElement {
  const [shareEmail, setShareEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [shareError, setShareError] = React.useState("");

  const { data: sharedUsers = [], isLoading: isLoadingUsers } =
    useSharedUsers();
  const { mutate: addUser, isPending: isAdding } = useShareWithUser();
  const { mutate: removeUser, isPending: isRemoving } = useDeleteSharedUser();

  const handleShare = () => {
    setEmailError("");
    setShareError("");

    if (!shareEmail) {
      return;
    }

    if (!EMAIL_RE.test(shareEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    addUser(shareEmail, {
      onSuccess: () => {
        setShareEmail("");
      },
      onError: (err) => {
        setShareError(
          err instanceof Error
            ? err.message
            : "Failed to share. Please try again.",
        );
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleShare();
    }
  };

  const handleRemove = (email: string) => {
    removeUser(email, {
      onError: (err) => {
        setShareError(
          err instanceof Error
            ? err.message
            : "Failed to remove access. Please try again.",
        );
      },
    });
  };

  return (
    <Section value="sharing" title="Sharing" icon={<UsersIcon size={18} />}>
      <SettingItem
        label="Share with Another User"
        description="Enter an email address to share your recipe book."
        fullWidth
      >
        <div className={styles.shareRow}>
          <input
            className={styles.shareInput}
            type="email"
            placeholder="user@example.com"
            value={shareEmail}
            onChange={(e) => {
              setShareEmail(e.target.value);
              setEmailError("");
              setShareError("");
            }}
            onKeyDown={handleKeyDown}
            disabled={isAdding}
            aria-invalid={Boolean(emailError)}
          />
          <button
            className={styles.btn}
            onClick={handleShare}
            disabled={!shareEmail || isAdding}
          >
            {isAdding ? "Sharing…" : "Share"}
          </button>
        </div>
        {emailError && <div className={styles.errorText}>{emailError}</div>}
        {shareError && <div className={styles.errorText}>{shareError}</div>}
        <div className={styles.sharedUsersList}>
          {isLoadingUsers ? (
            <div className={styles.emptyState}>Loading…</div>
          ) : sharedUsers.length === 0 ? (
            <div className={styles.emptyState}>
              {"You haven't shared your recipes with anyone yet."}
            </div>
          ) : (
            sharedUsers.map((email) => (
              <div key={email} className={styles.sharedUserItem}>
                <div className={styles.sharedUserInfo}>
                  <Avatar name={email.split("@")[0]} size="sm" />
                  {email}
                </div>
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleRemove(email)}
                  disabled={isRemoving}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </SettingItem>
    </Section>
  );
}
