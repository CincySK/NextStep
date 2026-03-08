import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { cn } from "./utils";
import { Button } from "./Button";

const CarouselContext = createContext(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function buildApi(stateRef) {
  return {
    scrollPrev: () => stateRef.scrollPrev(),
    scrollNext: () => stateRef.scrollNext(),
    canScrollPrev: () => stateRef.canScrollPrev(),
    canScrollNext: () => stateRef.canScrollNext()
  };
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const canScrollPrev = useCallback(() => currentIndex > 0, [currentIndex]);
  const canScrollNext = useCallback(() => currentIndex < totalSlides - 1, [currentIndex, totalSlides]);

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  const stateRef = useMemo(
    () => ({
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext
    }),
    [scrollPrev, scrollNext, canScrollPrev, canScrollNext]
  );

  useEffect(() => {
    if (!setApi) return;
    setApi(buildApi(stateRef));
  }, [setApi, stateRef]);

  const handleKeyDown = useCallback(
    (event) => {
      const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
      if (event.key === prevKey) {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === nextKey) {
        event.preventDefault();
        scrollNext();
      }
    },
    [orientation, scrollPrev, scrollNext]
  );

  const value = useMemo(
    () => ({
      opts,
      plugins,
      orientation,
      currentIndex,
      setCurrentIndex,
      totalSlides,
      setTotalSlides,
      scrollPrev,
      scrollNext,
      canScrollPrev: canScrollPrev(),
      canScrollNext: canScrollNext()
    }),
    [
      opts,
      plugins,
      orientation,
      currentIndex,
      totalSlides,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext
    ]
  );

  return (
    <CarouselContext.Provider value={value}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("ui-carousel", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, children, ...props }) {
  const { orientation, currentIndex, setTotalSlides } = useCarousel();
  const items = Children.toArray(children);

  useEffect(() => {
    setTotalSlides(items.length);
  }, [items.length, setTotalSlides]);

  const axisStyle = orientation === "horizontal"
    ? { transform: `translateX(-${currentIndex * 100}%)` }
    : { transform: `translateY(-${currentIndex * 100}%)` };

  return (
    <div className="ui-carousel-viewport" data-slot="carousel-content">
      <div
        className={cn(
          "ui-carousel-track",
          orientation === "horizontal" ? "ui-carousel-track-x" : "ui-carousel-track-y",
          className
        )}
        style={axisStyle}
        {...props}
      >
        {items.map((child, index) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              "data-carousel-index": index
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "ui-carousel-item",
        orientation === "horizontal" ? "ui-carousel-item-x" : "ui-carousel-item-y",
        className
      )}
      {...props}
    />
  );
}

function CarouselPrevious({ className, variant = "outline", size = "sm", ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "ui-carousel-nav ui-carousel-nav-prev",
        orientation === "horizontal" ? "ui-carousel-nav-x-prev" : "ui-carousel-nav-y-prev",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <span aria-hidden="true">{"<"}</span>
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({ className, variant = "outline", size = "sm", ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "ui-carousel-nav ui-carousel-nav-next",
        orientation === "horizontal" ? "ui-carousel-nav-x-next" : "ui-carousel-nav-y-next",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <span aria-hidden="true">{">"}</span>
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
};
