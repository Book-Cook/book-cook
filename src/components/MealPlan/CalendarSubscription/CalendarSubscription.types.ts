/**
 * Types for calendar subscription components
 */

export type CalendarTokenData = {
  token: string;
  createdAt: string;
  subscriptionUrl: string;
  webcalUrl: string;
};

export type CalendarSubscriptionProps = {
  onClose?: () => void;
};