import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

/** Aborts a Next.js route transition the user has not confirmed yet. */
class RouteChangeAbortedError extends Error {
  /** Next.js swallows route errors flagged as cancelled instead of rethrowing. */
  readonly cancelled = true;

  constructor() {
    super("Route change aborted by the unsaved changes guard");
    this.name = "RouteChangeAbortedError";
  }
}

export interface UseUnsavedChangesGuardOptions {
  /** While true, navigation away from the page is intercepted. */
  enabled: boolean;
}

export interface UnsavedChangesGuard {
  /** True while a navigation is held back awaiting the user's decision. */
  isBlocked: boolean;

  /** Abandons the held navigation and stays on the page. */
  stay: () => void;

  /** Completes the held navigation, discarding whatever was unsaved. */
  discard: () => void;

  /**
   * Runs an action that would destroy unsaved work, prompting first when the
   * guard is enabled. Use for in-page destructive actions such as Cancel.
   */
  guardAction: (action: () => void) => void;
}

/**
 * Intercepts every way a user can leave unsaved work behind: in-app navigation,
 * the browser back button, tab close or reload, and destructive in-page actions.
 *
 * The hook owns only the decision to block; rendering the prompt is left to the
 * caller so it can use the app's own ConfirmDialog rather than window.confirm.
 */
export const useUnsavedChangesGuard = ({
  enabled,
}: UseUnsavedChangesGuardOptions): UnsavedChangesGuard => {
  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState(false);
  const pendingUrl = useRef<string | null>(null);
  const pendingAction = useRef<(() => void) | null>(null);
  const bypass = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleRouteChangeStart = (url: string) => {
      if (bypass.current) {
        bypass.current = false;
        return;
      }
      if (url === router.asPath) {
        return;
      }

      pendingUrl.current = url;
      pendingAction.current = null;
      setIsBlocked(true);
      const abort = new RouteChangeAbortedError();
      router.events.emit("routeChangeError", abort, url, { shallow: false });
      throw abort;
    };

    // Back/forward navigation is cancelled before it reaches routeChangeStart,
    // so the popped history entry has to be pushed back to keep the URL honest.
    router.beforePopState(({ url }) => {
      if (bypass.current) {
        bypass.current = false;
        return true;
      }
      pendingUrl.current = url;
      pendingAction.current = null;
      setIsBlocked(true);
      window.history.pushState(null, "", router.asPath);
      return false;
    });

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.beforePopState(() => true);
    };
  }, [enabled, router]);

  const stay = useCallback(() => {
    pendingUrl.current = null;
    pendingAction.current = null;
    setIsBlocked(false);
  }, []);

  const discard = useCallback(() => {
    const url = pendingUrl.current;
    const action = pendingAction.current;
    pendingUrl.current = null;
    pendingAction.current = null;
    setIsBlocked(false);

    if (action) {
      action();
      return;
    }
    if (url) {
      bypass.current = true;
      void router.push(url);
    }
  }, [router]);

  const guardAction = useCallback(
    (action: () => void) => {
      if (!enabled) {
        action();
        return;
      }
      pendingAction.current = action;
      pendingUrl.current = null;
      setIsBlocked(true);
    },
    [enabled]
  );

  return { isBlocked, stay, discard, guardAction };
};
