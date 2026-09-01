"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HOME_IMAGES } from "./home-images";

const MOBILE_BREAKPOINT = 768;
const SWIPE_THRESHOLD = 50;

function getVisibleCount(width: number) {
  return width >= MOBILE_BREAKPOINT ? 5 : 1;
}

export function HomeImagesCarousel() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(HOME_IMAGES.length);
  const [enableTransition, setEnableTransition] = useState(true);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const extendedImages = useMemo(
    () => [...HOME_IMAGES, ...HOME_IMAGES, ...HOME_IMAGES],
    []
  );

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const goToPrevious = useCallback(() => {
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToNext = useCallback(() => {
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= HOME_IMAGES.length * 2) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - HOME_IMAGES.length);
      return;
    }

    if (currentIndex < HOME_IMAGES.length) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + HOME_IMAGES.length);
    }
  };

  useEffect(() => {
    if (!enableTransition) {
      const frame = requestAnimationFrame(() => {
        setEnableTransition(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [enableTransition, currentIndex]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goToPrevious();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goToNext();
    }
  };

  const slideOffset = (100 / visibleCount) * currentIndex;

  return (
    <section id="our-works" className="container mx-auto space-y-6 px-4 pt-16 scroll-mt-24">
      <h2 className="text-2xl font-bold">Our Works</h2>
      <Card className="glass-card overflow-hidden">
        <div className="relative h-52 md:h-64">
          <div
            className="h-full overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={cn(
                "flex h-full",
                enableTransition && "transition-transform duration-300 ease-out"
              )}
              style={{ transform: `translateX(-${slideOffset}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedImages.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative h-full w-full shrink-0 overflow-hidden md:w-1/5"
                >
                  <Image
                    src={image}
                    alt={`Harvest gallery image ${(index % HOME_IMAGES.length) + 1}`}
                    fill
                    className="object-cover"
                    sizes={
                      visibleCount === 1
                        ? "100vw"
                        : "(min-width: 768px) 20vw, 100vw"
                    }
                    priority={index >= HOME_IMAGES.length && index < HOME_IMAGES.length * 2}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-md"
            onClick={goToPrevious}
            aria-label="Previous images"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-md"
            onClick={goToNext}
            aria-label="Next images"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
