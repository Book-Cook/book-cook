import { renderHook, act } from "@testing-library/react";

import { useAppTheme } from "./useAppTheme";

// Helpers to mock matchMedia
function makeMockMq(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mq = {
    matches,
    addEventListener: jest.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb);
    }),
    removeEventListener: jest.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(cb);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    }),
    // Helper to fire a change event in tests
    _fire(newMatches: boolean) {
      listeners.forEach((cb) =>
        cb({ matches: newMatches } as MediaQueryListEvent)
      );
    },
  };
  return mq;
}

describe("useAppTheme", () => {
  let mockMq: ReturnType<typeof makeMockMq>;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    mockMq = makeMockMq(false); // default: light system
    window.matchMedia = jest.fn().mockReturnValue(mockMq);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.restoreAllMocks();
  });

  describe("initial theme", () => {
    it("reads system preference (dark) when no stored preference", () => {
      mockMq = makeMockMq(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("dark");
    });

    it("reads system preference (light) when no stored preference", () => {
      mockMq = makeMockMq(false);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("light");
    });

    it("uses stored 'dark' preference over system light", () => {
      localStorage.setItem("theme", "dark");

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("dark");
    });

    it("uses stored 'light' preference over system dark", () => {
      localStorage.setItem("theme", "light");
      mockMq = makeMockMq(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("light");
    });

    it("ignores invalid stored value and falls back to system", () => {
      localStorage.setItem("theme", "invalid-value");
      mockMq = makeMockMq(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("updates theme and persists to localStorage", () => {
      const { result } = renderHook(() => useAppTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("returns a stable setTheme reference (no rerenders)", () => {
      const { result, rerender } = renderHook(() => useAppTheme());
      const first = result.current.setTheme;
      rerender();
      expect(result.current.setTheme).toBe(first);
    });
  });

  describe("system preference listener", () => {
    it("registers a change listener on mount", () => {
      renderHook(() => useAppTheme());
      expect(mockMq.addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });

    it("removes the listener on unmount", () => {
      const { unmount } = renderHook(() => useAppTheme());
      unmount();
      expect(mockMq.removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });

    it("follows system change to dark when no explicit preference stored", () => {
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("light");

      act(() => {
        mockMq._fire(true); // OS switches to dark
      });

      expect(result.current.theme).toBe("dark");
    });

    it("follows system change to light when no explicit preference stored", () => {
      mockMq = makeMockMq(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("dark");

      act(() => {
        mockMq._fire(false); // OS switches to light
      });

      expect(result.current.theme).toBe("light");
    });

    it("does NOT follow system change after user sets explicit preference", () => {
      const { result } = renderHook(() => useAppTheme());

      act(() => {
        result.current.setTheme("dark"); // explicit choice
      });

      act(() => {
        mockMq._fire(false); // OS switches to light — should be ignored
      });

      expect(result.current.theme).toBe("dark");
    });

    it("does NOT follow system change when localStorage already has a preference", () => {
      localStorage.setItem("theme", "light");
      mockMq = makeMockMq(false);
      window.matchMedia = jest.fn().mockReturnValue(mockMq);

      const { result } = renderHook(() => useAppTheme());

      act(() => {
        mockMq._fire(true); // OS switches to dark
      });

      expect(result.current.theme).toBe("light");
    });
  });
});
