import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import {
  Input,
  Button,
  tokens,
  Text,
  Spinner,
  Avatar,
} from "@fluentui/react-components";
import { PersonAddRegular, PersonDeleteRegular } from "@fluentui/react-icons";
import { SettingsSection, SettingItem } from "../SettingShared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  statusMessage: {
    marginTop: "8px",
  },
  success: {
    color: tokens.colorPaletteGreenForeground1,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
});

// Mock API calls - replace with your actual fetch calls
const fetchSharedUsers = async () => {
  const response = await fetch("/api/recipes/share");
  if (!response.ok) {
    throw new Error("Failed to load shared users");
  }
  const data = await response.json();
  return data.sharedWithUsers || [];
};

const shareWithUser = async (email: string) => {
  const response = await fetch("/api/recipes/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shareWithEmail: email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to share");
  }
  return await response.json();
};

const removeUserAccess = async (email: string) => {
  const response = await fetch("/api/recipes/share", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shareWithEmail: email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove access");
  }
  return await response.json();
};

export const SharingSection: React.FC = () => {
  const styles = useStyles();
  const [email, setEmail] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: sharedUsers = [], isLoading } = useQuery({
    queryKey: ["sharedUsers"],
    queryFn: fetchSharedUsers,
  });

  const shareMutation = useMutation({
    mutationFn: shareWithUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedUsers"] });
      setEmail("");
      setStatusMessage({
        text: "Successfully shared recipe book",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 3000);
    },
    onError: (error: Error) => {
      setStatusMessage({
        text: error.message,
        type: "error",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeUserAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedUsers"] });
      setStatusMessage({
        text: "Access removed successfully",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 3000);
    },
    onError: (error: Error) => {
      setStatusMessage({
        text: error.message,
        type: "error",
      });
    },
  });

  const handleShare = () => {
    if (email.trim()) {
      shareMutation.mutate(email.trim());
    }
  };

  const handleRemoveAccess = (emailToRemove: string) => {
    if (confirm(`Remove access for ${emailToRemove}?`)) {
      removeMutation.mutate(emailToRemove);
    }
  };

  const isPending = shareMutation.isPending || removeMutation.isPending;

  return (
    <SettingsSection title="Sharing" itemValue="sharing">
      <SettingItem
        label="Share Recipe Book"
        description="Share your entire recipe collection with others by email."
        statusMessage={statusMessage}
        fullWidth
      >
        <div className={styles.shareContainer}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            type="email"
            disabled={isPending}
          />
          <Button
            icon={<PersonAddRegular />}
            onClick={handleShare}
            disabled={!email.trim() || isPending}
          >
            Share
          </Button>
        </div>

        {isLoading ? (
          <Spinner size="tiny" label="Loading shared users..." />
        ) : sharedUsers.length === 0 ? (
          <div className={styles.emptyState}>
            You haven't shared your recipes with anyone yet.
          </div>
        ) : (
          <div className={styles.usersList}>
            {sharedUsers.map((userEmail: string) => (
              <div key={userEmail} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <Avatar
                    name={userEmail.split("@")[0]}
                    size={24}
                    color="colorful"
                  />
                  <Text>{userEmail}</Text>
                </div>
                <Button
                  icon={<PersonDeleteRegular />}
                  appearance="subtle"
                  size="small"
                  onClick={() => handleRemoveAccess(userEmail)}
                  title="Remove access"
                  aria-label={`Remove ${userEmail}'s access`}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        )}
      </SettingItem>
    </SettingsSection>
  );
};
