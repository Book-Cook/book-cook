import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

interface UseCarouselNavigationProps {
  emblaOptions?: EmblaOptionsType;
  initialScrollIndex?: number;
}

interface UseCarouselNavigationReturn {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Encapsulates Embla carousel setup, scroll state, and keyboard navigation.
 */
export function useCarouselNavigation({
  emblaOptions,
  initialScrollIndex,
}: UseCarouselNavigationProps): UseCarouselNavigationReturn {
  const options = {
    align: "start" as const,
    containScroll: "trimSnaps" as const,
    ...emblaOptions,
  };

  const [viewportRef, emblaApi] = useEmblaCarousel(options);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const onScrollUpdate = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    onScrollUpdate();
    emblaApi.on("select", onScrollUpdate);
    emblaApi.on("reInit", onScrollUpdate);
    return () => {
      emblaApi.off("select", onScrollUpdate);
      emblaApi.off("reInit", onScrollUpdate);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || initialScrollIndex == null || initialScrollIndex <= 0) {
      return;
    }
    emblaApi.scrollTo(initialScrollIndex, true);
  }, [emblaApi, initialScrollIndex]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi.scrollPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi.scrollNext();
    }
    if (event.key === "Home") {
      event.preventDefault();
      emblaApi.scrollTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = emblaApi.scrollSnapList().length - 1;
      if (lastIndex >= 0) {
        emblaApi.scrollTo(lastIndex);
      }
    }
  };

  return {
    viewportRef,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    handleKeyDown,
  };
}
