import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const getMatches = () => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(query);
    const setMatchesIfNeeded = (next: boolean) => {
      setMatches((prev) => (prev === next ? prev : next));
    };
    const handleChange = () => setMatchesIfNeeded(mediaQueryList.matches);

    setMatchesIfNeeded(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
