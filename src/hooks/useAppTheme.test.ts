import { renderHook, act } from "@testing-library/react";

import { useAppTheme } from "./useAppTheme";

describe("useAppTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("initial theme", () => {
    it("defaults to 'system' when no stored preference", () => {
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("system");
    });

    it("returns stored 'dark' preference", () => {
      localStorage.setItem("theme", "dark");
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("dark");
    });

    it("returns stored 'light' preference", () => {
      localStorage.setItem("theme", "light");
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("light");
    });

    it("returns stored 'system' preference", () => {
      localStorage.setItem("theme", "system");
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("system");
    });

    it("falls back to 'system' for invalid stored value", () => {
      localStorage.setItem("theme", "invalid-value");
      const { result } = renderHook(() => useAppTheme());
      expect(result.current.theme).toBe("system");
    });
  });

  describe("setTheme", () => {
    it("updates theme to dark and persists to localStorage", () => {
      const { result } = renderHook(() => useAppTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("updates theme to light and persists to localStorage", () => {
      const { result } = renderHook(() => useAppTheme());

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.theme).toBe("light");
      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("updates theme to system and persists to localStorage", () => {
      const { result } = renderHook(() => useAppTheme());

      act(() => {
        result.current.setTheme("system");
      });

      expect(result.current.theme).toBe("system");
      expect(localStorage.getItem("theme")).toBe("system");
    });

    it("returns a stable setTheme reference (no rerenders)", () => {
      const { result, rerender } = renderHook(() => useAppTheme());
      const first = result.current.setTheme;
      rerender();
      expect(result.current.setTheme).toBe(first);
    });
  });
});
