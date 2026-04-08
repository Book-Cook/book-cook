import { useEffect, useState } from "react";

import type { CalendarTokenData } from "./CalendarSubscription.types";

interface UseCalendarSubscriptionReturn {
  tokenData: CalendarTokenData | null;
  loading: boolean;
  error: string | null;
  copySuccess: "subscription" | "webcal" | null;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  fetchTokenData: () => Promise<void>;
  createToken: () => Promise<void>;
  deleteToken: () => Promise<void>;
  copyToClipboard: (
    text: string,
    type: "subscription" | "webcal",
  ) => Promise<void>;
}

/**
 * Manages calendar subscription token state and API interactions.
 */
export function useCalendarSubscription(): UseCalendarSubscriptionReturn {
  const [tokenData, setTokenData] = useState<CalendarTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<
    "subscription" | "webcal" | null
  >(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    void fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meal-plans/calendar-token");

      if (response.status === 404) {
        setTokenData(null);
        setError(null);
      } else if (response.ok) {
        const data = await response.json();
        setTokenData(data);
        setError(null);
      } else {
        throw new Error("Failed to fetch calendar token");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/meal-plans/calendar-token", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create calendar token");
      }

      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/meal-plans/calendar-token", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete calendar token");
      }

      setTokenData(null);
      setShowDeleteDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    type: "subscription" | "webcal",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return {
    tokenData,
    loading,
    error,
    copySuccess,
    showDeleteDialog,
    setShowDeleteDialog,
    fetchTokenData,
    createToken,
    deleteToken,
    copyToClipboard,
  };
}
