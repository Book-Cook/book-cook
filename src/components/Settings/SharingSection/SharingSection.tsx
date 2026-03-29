import * as React from "react";
import { UserPlusIcon, UserMinusIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import styles from "./SharingSection.module.css";
import { sharingSectionId } from "../constants";
import { useSettingsSection } from "../context";
import { SettingsSection, SettingItem } from "../SettingShared";

import {
  useDeleteSharedUser,
  useShareWithUser,
  useSharedUsers,
} from "../../../clientToServer";
import { Avatar } from "../../Avatar";
import { Button } from "../../Button";
import { Input } from "../../Input";
import { Spinner } from "../../Spinner";
import { Text } from "../../Text";

// Define search keywords for each section
const sectionKeywords = ["sharing", "share", "collaborate", "access"];
const shareUserKeywords = [
  "share with user",
  "share with another user",
  "add user",
  "invite",
  "email",
  "collaborate",
];

export const SharingSection: React.FC = () => {
  const [shareEmail, setShareEmail] = React.useState("");

  const { data: sharedUsers = [], isLoading } = useSharedUsers();
  const shareRecipeMutation = useShareWithUser();
  const removeAccessMutation = useDeleteSharedUser();

  const { isVisible, searchTerm } = useSettingsSection(sharingSectionId, [
    ...sectionKeywords,
    ...shareUserKeywords,
  ]);

  const sectionMatches =
    !searchTerm || sectionKeywords.some((k) => k.includes(searchTerm));
  const shareUserItemMatches =
    !searchTerm || shareUserKeywords.some((k) => k.includes(searchTerm));

  const handleShareRecipeBook = async () => {
    if (!shareEmail) {return;}

    try {
      await shareRecipeMutation.mutateAsync(shareEmail);
      toast.success("Book cook shared successfully!");
      setShareEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to share your book cook"
      );
    }
  };

  const handleRemoveAccess = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) {
      return;
    }

    try {
      await removeAccessMutation.mutateAsync(email);
      toast.success(`Access for ${email} has been removed.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove access"
      );
    }
  };

  const isSharing =
    shareRecipeMutation.isPending || removeAccessMutation.isPending;

  // Return null if searching and this section doesn't match
  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Sharing"
      itemValue={sharingSectionId}
      icon={<UserPlusIcon />}
    >
      {(!searchTerm || shareUserItemMatches || sectionMatches) && (
        <SettingItem
          label="Share with Another User"
          description="Enter an email address to share your recipe book with another user."
          fullWidth
        >
          <div className={styles.shareContainer}>
            <Input
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="user@example.com"
              type="email"
              disabled={isSharing}
              fullWidth
            />
            <Button
              icon={<UserPlusIcon />}
              onClick={handleShareRecipeBook}
              disabled={!shareEmail || isSharing}
            >
              {isSharing ? <Spinner size="tiny" /> : "Share"}
            </Button>
          </div>
          <div className={styles.usersList}>
            {isLoading ? (
              <Spinner size="tiny" />
            ) : sharedUsers.length === 0 ? (
              <div className={styles.emptyState}>
                {`You haven't shared your recipes with anyone yet.`}
              </div>
            ) : (
              sharedUsers.map((email) => (
                <div key={email} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <Avatar
                      name={email.split("@")[0]}
                      size="sm"
                    />
                    <Text>{email}</Text>
                  </div>
                  <Button
                    icon={<UserMinusIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAccess(email)}
                    aria-label={`Remove ${email}'s access`}
                    disabled={isSharing}
                  />
                </div>
              ))
            )}
          </div>
        </SettingItem>
      )}
    </SettingsSection>
  );
};
