import * as React from "react";
import { Input, Button, tokens, Avatar, useToastController, Toast, ToastTitle, ToastBody, Toaster, useId } from "@fluentui/react-components";
import {
  PersonAddRegular,
  PersonAdd24Regular,
  PersonDeleteRegular,
} from "@fluentui/react-icons";
import { makeStyles, shorthands } from "@griffel/react";

import { sharingSectionId } from "../constants";
import { useSettingsSection } from "../context";
import { SettingsSection, SettingItem } from "../SettingShared";

import {
  useShareWithUser,
  useDeleteSharedUser,
  useSharedUsers,
} from "../../../clientToServer";
import { Spinner } from "../../Spinner";
import { Text } from "../../Text";
import { Spinner } from "../../Spinner";

const useStyles = makeStyles({
  shareContainer: {
    display: "flex",
    gap: "8px",
    width: "100%",
  },
  usersList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "16px",
    width: "100%",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("8px", "12px"),
    ...shorthands.borderRadius("6px"),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  emptyState: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
    ...shorthands.padding("8px", "0"),
  },
});

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
  const styles = useStyles();
  const [shareEmail, setShareEmail] = React.useState("");

  const toasterId = useId("sharing-toaster");
  const { dispatchToast } = useToastController(toasterId);

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

      // Show success toast
      dispatchToast(
        <Toast>
          <ToastTitle>Success</ToastTitle>
          <ToastBody>Book cook shared successfully!</ToastBody>
        </Toast>,
        { position: "bottom-end", intent: "success", timeout: 1000 }
      );

      setShareEmail("");
    } catch (error) {
      // Show error toast
      dispatchToast(
        <Toast>
          <ToastTitle>Error</ToastTitle>
          <ToastBody>
            {error instanceof Error
              ? error.message
              : "Failed to share your book cook"}
          </ToastBody>
        </Toast>,
        { position: "bottom-end", intent: "error", timeout: 2000 }
      );
    }
  };

  const handleRemoveAccess = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) {
      return;
    }

    try {
      await removeAccessMutation.mutateAsync(email);

      // Show success toast for removing access
      dispatchToast(
        <Toast>
          <ToastTitle>Access Removed</ToastTitle>
          <ToastBody>{`Access for ${email} has been removed.`}</ToastBody>
        </Toast>,
        { position: "bottom-end", intent: "success", timeout: 1000 }
      );
    } catch (error) {
      // Show error toast
      dispatchToast(
        <Toast>
          <ToastTitle>Error</ToastTitle>
          <ToastBody>
            {error instanceof Error ? error.message : "Failed to remove access"}
          </ToastBody>
        </Toast>,
        { position: "bottom-end", intent: "error", timeout: 2000 }
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
    <>
      <Toaster toasterId={toasterId} />
      <SettingsSection
        title="Sharing"
        itemValue={sharingSectionId}
        icon={<PersonAdd24Regular />}
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
                style={{ flexGrow: 1 }}
              />
              <Button
                icon={<PersonAddRegular />}
                onClick={handleShareRecipeBook}
                disabled={!shareEmail || isSharing}
              >
                {isSharing ? <Spinner size="tiny" /> : "Share"}
              </Button>
            </div>
            <div className={styles.usersList}>
              {isLoading ? (
                <Spinner size="tiny" label="Loading shared users..." />
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
                        size={24}
                        color="colorful"
                      />
                      <Text>{email}</Text>
                    </div>
                    <Button
                      icon={<PersonDeleteRegular />}
                      appearance="subtle"
                      size="small"
                      onClick={() => handleRemoveAccess(email)}
                      title="Remove access"
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
    </>
  );
};
