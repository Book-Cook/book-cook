/**
 * Calendar subscription management component
 */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  Caption1,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import {
  Copy24Regular,
  Add24Regular,
  CheckmarkCircle16Regular
} from '@fluentui/react-icons';

import type { CalendarTokenData, CalendarSubscriptionProps } from './CalendarSubscription.types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: '500px',
    color: tokens.colorNeutralForeground1,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  inputGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
  },
  instructions: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1Hover,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  instructionList: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    color: `${tokens.colorPaletteRedForeground1} !important`,
    '& svg': {
      color: `${tokens.colorPaletteRedForeground1} !important`,
    },
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground1,
      color: `${tokens.colorPaletteRedForeground1} !important`,
    },
    ':hover svg': {
      color: `${tokens.colorPaletteRedForeground1} !important`,
    },
  },
  deleteButtonPrimary: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    border: `1px solid ${tokens.colorPaletteRedBorder2}`,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    ':active': {
      backgroundColor: tokens.colorPaletteRedBackground1,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '& svg': {
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXL,
  }
});

export const CalendarSubscription: React.FC<CalendarSubscriptionProps> = () => {
  const styles = useStyles();
  const [tokenData, setTokenData] = useState<CalendarTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<'subscription' | 'webcal' | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    void fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meal-plans/calendar-token');

      if (response.status === 404) {
        setTokenData(null);
        setError(null);
      } else if (response.ok) {
        const data = await response.json();
        setTokenData(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch calendar token');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/meal-plans/calendar-token', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar token');
      }

      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/meal-plans/calendar-token', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete calendar token');
      }

      setTokenData(null);
      setShowDeleteDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'subscription' | 'webcal') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (loading && !tokenData) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="small" label="Loading..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}

      {!tokenData ? (
        <div className={styles.section}>
          <Text>Sync your meal plan with your calendar app for easy access.</Text>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={createToken}
            disabled={loading}
          >
            Create Subscription
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.section}>
            <Caption1>Subscription URL</Caption1>
            <div className={styles.inputGroup}>
              <Input
                className={styles.input}
                value={tokenData.subscriptionUrl}
                readOnly
                size="small"
              />
              <Button
                size="small"
                icon={copySuccess === 'subscription' ? <CheckmarkCircle16Regular /> : <Copy24Regular />}
                onClick={() => copyToClipboard(tokenData.subscriptionUrl, 'subscription')}
              />
            </div>
          </div>

          <div className={styles.section}>
            <Caption1>Webcal URL (iOS/macOS)</Caption1>
            <div className={styles.inputGroup}>
              <Input
                className={styles.input}
                value={tokenData.webcalUrl}
                readOnly
                size="small"
              />
              <Button
                size="small"
                icon={copySuccess === 'webcal' ? <CheckmarkCircle16Regular /> : <Copy24Regular />}
                onClick={() => copyToClipboard(tokenData.webcalUrl, 'webcal')}
              />
            </div>
          </div>

          <div className={styles.instructions}>
            <Caption1>Quick Setup:</Caption1>
            <ul className={styles.instructionList}>
              <li>Google Calendar: Settings → Add calendar → From URL</li>
              <li>Apple: Click the webcal URL or paste in Calendar app</li>
              <li>Outlook: File → Account Settings → Internet Calendars</li>
            </ul>
          </div>

          <div className={styles.section}>
            <Dialog open={showDeleteDialog} onOpenChange={(_, data) => setShowDeleteDialog(data.open)}>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  size="small"
                  appearance="subtle"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={loading}
                  className={styles.deleteButton}
                >
                  Delete Subscription
                </Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Delete Calendar Subscription</DialogTitle>
                  <DialogContent>
                    <Text>
                      Are you sure you want to delete your calendar subscription?
                      This will invalidate all existing calendar subscriptions and cannot be undone.
                    </Text>
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Cancel</Button>
                    </DialogTrigger>
                    <Button
                      appearance="primary"
                      onClick={deleteToken}
                      disabled={loading}
                      className={styles.deleteButtonPrimary}
                    >
                      Delete Subscription
                    </Button>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
          </div>

          <div className={styles.footer}>
            <Caption1>
              Created {new Date(tokenData.createdAt).toLocaleDateString()}
            </Caption1>
          </div>
        </>
      )}
    </div>
  );
};
