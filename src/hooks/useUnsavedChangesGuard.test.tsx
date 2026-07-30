import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/router";

import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

type RouteHandler = (url: string) => void;
type PopStateHandler = (state: { url: string }) => boolean;

const createRouterMock = () => {
  const routeChangeStart = new Set<RouteHandler>();
  let popStateHandler: PopStateHandler = () => true;

  const router = {
    asPath: "/recipes/abc",
    push: jest.fn(() => Promise.resolve(true)),
    beforePopState: jest.fn((handler: PopStateHandler) => {
      popStateHandler = handler;
    }),
    events: {
      on: jest.fn((event: string, handler: RouteHandler) => {
        if (event === "routeChangeStart") {
          routeChangeStart.add(handler);
        }
      }),
      off: jest.fn((event: string, handler: RouteHandler) => {
        if (event === "routeChangeStart") {
          routeChangeStart.delete(handler);
        }
      }),
      emit: jest.fn(),
    },
    /** Simulates a Link click or router.push, returning whether it was blocked. */
    navigate: (url: string) => {
      let blocked = false;
      routeChangeStart.forEach((handler) => {
        try {
          handler(url);
        } catch {
          blocked = true;
        }
      });
      return blocked;
    },
    /** Simulates the browser back button. */
    popState: (url: string) => popStateHandler({ url }),
    hasRouteListeners: () => routeChangeStart.size > 0,
  };

  return router;
};

let router: ReturnType<typeof createRouterMock>;

beforeEach(() => {
  router = createRouterMock();
  (useRouter as jest.Mock).mockReturnValue(router);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("useUnsavedChangesGuard", () => {
  describe("when there is nothing unsaved", () => {
    it("lets navigation through untouched", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: false })
      );

      expect(router.navigate("/recipes/other")).toBe(false);
      expect(result.current.isBlocked).toBe(false);
    });

    it("does not warn on tab close", () => {
      const addEventListener = jest.spyOn(window, "addEventListener");

      renderHook(() => useUnsavedChangesGuard({ enabled: false }));

      expect(addEventListener).not.toHaveBeenCalledWith(
        "beforeunload",
        expect.any(Function)
      );
      addEventListener.mockRestore();
    });

    it("runs a destructive action immediately without prompting", () => {
      const action = jest.fn();
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: false })
      );

      act(() => result.current.guardAction(action));

      expect(action).toHaveBeenCalledTimes(1);
      expect(result.current.isBlocked).toBe(false);
    });
  });

  describe("when there is unsaved work", () => {
    it("blocks in-app navigation and reports it", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      let blocked = false;
      act(() => {
        blocked = router.navigate("/recipes/other");
      });

      expect(blocked).toBe(true);
      expect(result.current.isBlocked).toBe(true);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("blocks the browser back button and restores the current URL", () => {
      const pushState = jest.spyOn(window.history, "pushState");
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      let allowed = true;
      act(() => {
        allowed = router.popState("/recipes/other");
      });

      expect(allowed).toBe(false);
      expect(result.current.isBlocked).toBe(true);
      expect(pushState).toHaveBeenCalledWith(null, "", "/recipes/abc");
      pushState.mockRestore();
    });

    it("warns before the tab is closed or reloaded", () => {
      renderHook(() => useUnsavedChangesGuard({ enabled: true }));

      const event = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it("ignores a route change to the page it is already on", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => {
        expect(router.navigate("/recipes/abc")).toBe(false);
      });

      expect(result.current.isBlocked).toBe(false);
    });

    it("stays on the page and keeps the work when the user backs out", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => {
        router.navigate("/recipes/other");
      });
      act(() => result.current.stay());

      expect(result.current.isBlocked).toBe(false);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("completes the held navigation when the user discards", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => {
        router.navigate("/recipes/other");
      });
      act(() => result.current.discard());

      expect(result.current.isBlocked).toBe(false);
      expect(router.push).toHaveBeenCalledWith("/recipes/other");
    });

    it("does not re-block the navigation it was told to allow", () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => {
        router.navigate("/recipes/other");
      });
      act(() => result.current.discard());

      let blockedAgain = false;
      act(() => {
        blockedAgain = router.navigate("/recipes/other");
      });

      expect(blockedAgain).toBe(false);
    });

    it("holds a destructive action until the user confirms it", () => {
      const action = jest.fn();
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => result.current.guardAction(action));
      expect(action).not.toHaveBeenCalled();
      expect(result.current.isBlocked).toBe(true);

      act(() => result.current.discard());
      expect(action).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("abandons a destructive action when the user backs out", () => {
      const action = jest.fn();
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({ enabled: true })
      );

      act(() => result.current.guardAction(action));
      act(() => result.current.stay());

      expect(action).not.toHaveBeenCalled();
      expect(result.current.isBlocked).toBe(false);
    });
  });

  it("releases every listener once the work is saved", () => {
    const removeEventListener = jest.spyOn(window, "removeEventListener");
    const { rerender } = renderHook(
      ({ enabled }) => useUnsavedChangesGuard({ enabled }),
      { initialProps: { enabled: true } }
    );

    expect(router.hasRouteListeners()).toBe(true);

    rerender({ enabled: false });

    expect(router.hasRouteListeners()).toBe(false);
    expect(removeEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    expect(router.navigate("/recipes/other")).toBe(false);
    removeEventListener.mockRestore();
  });
});
