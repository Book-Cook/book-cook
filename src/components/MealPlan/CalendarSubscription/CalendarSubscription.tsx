/**
 * Calendar subscription management component
 */
import React from "react";
import { CheckCircleIcon, CopyIcon, PlusIcon } from "@phosphor-icons/react";

import styles from "./CalendarSubscription.module.css";
import type { CalendarSubscriptionProps } from "./CalendarSubscription.types";
import { useCalendarSubscription } from "./useCalendarSubscription";

import { Button } from "../../Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../../Dialog";
import { Input } from "../../Input";
import { Spinner } from "../../Spinner";
import { Text } from "../../Text";

export const CalendarSubscription: React.FC<CalendarSubscriptionProps> = () => {
  const {
    tokenData,
    loading,
    error,
    copySuccess,
    showDeleteDialog,
    setShowDeleteDialog,
    createToken,
    deleteToken,
    copyToClipboard,
  } = useCalendarSubscription();

  if (loading && !tokenData) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="small" label="Loading..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorBar}>{error}</div>}

      {!tokenData ? (
        <div className={styles.section}>
          <Text>
            Sync your meal plan with your calendar app for easy access.
          </Text>
          <Button
            appearance="primary"
            startIcon={<PlusIcon size={16} />}
            onClick={createToken}
            disabled={loading}
          >
            Create Subscription
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.section}>
            <span>Subscription URL</span>
            <div className={styles.inputGroup}>
              <Input
                className={styles.input}
                value={tokenData.subscriptionUrl}
                readOnly
                size="sm"
              />
              <Button
                size="sm"
                startIcon={
                  copySuccess === "subscription" ? (
                    <CheckCircleIcon size={16} />
                  ) : (
                    <CopyIcon size={16} />
                  )
                }
                onClick={() =>
                  copyToClipboard(tokenData.subscriptionUrl, "subscription")
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <span>Webcal URL (iOS/macOS)</span>
            <div className={styles.inputGroup}>
              <Input
                className={styles.input}
                value={tokenData.webcalUrl}
                readOnly
                size="sm"
              />
              <Button
                size="sm"
                startIcon={
                  copySuccess === "webcal" ? (
                    <CheckCircleIcon size={16} />
                  ) : (
                    <CopyIcon size={16} />
                  )
                }
                onClick={() => copyToClipboard(tokenData.webcalUrl, "webcal")}
              />
            </div>
          </div>

          <div className={styles.instructions}>
            <span>Quick Setup:</span>
            <ul className={styles.instructionList}>
              <li>Google Calendar: Settings → Add calendar → From URL</li>
              <li>Apple: Click the webcal URL or paste in Calendar app</li>
              <li>Outlook: File → Account Settings → Internet Calendars</li>
            </ul>
          </div>

          <div className={styles.section}>
            <Button
              size="sm"
              appearance="subtle"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
              className={styles.deleteButton}
            >
              Delete Subscription
            </Button>

            <Dialog
              open={showDeleteDialog}
              onOpenChange={(open) => setShowDeleteDialog(open)}
            >
              <DialogContent withCloseButton={false}>
                <DialogBody>
                  <DialogTitle>Delete Calendar Subscription</DialogTitle>
                  <Text>
                    Are you sure you want to delete your calendar subscription?
                    This will invalidate all existing calendar subscriptions and
                    cannot be undone.
                  </Text>
                </DialogBody>
                <DialogFooter>
                  <Button
                    appearance="secondary"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    appearance="primary"
                    onClick={deleteToken}
                    disabled={loading}
                    className={styles.deleteButtonPrimary}
                  >
                    Delete Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className={styles.footer}>
            <span>
              Created {new Date(tokenData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
