'use client';

import { useRef, useState, useEffect, useCallback, Children } from 'react';
import { cn } from '@/lib/utils';

interface MobileCarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  className?: string;
  itemClassName?: string;
  /** Width of each item: 'full' = 100%, 'large' = 85%, 'medium' = 75%, 'small' = 65% */
  itemWidth?: 'full' | 'large' | 'medium' | 'small';
}

const widthMap = {
  full: 'min-w-[100%]',
  large: 'min-w-[85%]',
  medium: 'min-w-[75%]',
  small: 'min-w-[65%]',
};

export default function MobileCarousel({
  children,
  autoPlay = false,
  autoPlayInterval = 4000,
  showDots = true,
  className,
  itemClassName,
  itemWidth = 'large',
}: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const childCount = Children.count(children);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isUserScrolling = useRef(false);

  // Detect active slide from scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const itemW = el.scrollWidth / childCount;
    const newIndex = Math.round(scrollLeft / itemW);
    setActiveIndex(Math.min(newIndex, childCount - 1));
  }, [childCount]);

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const itemW = el.scrollWidth / childCount;
    el.scrollTo({ left: itemW * index, behavior: 'smooth' });
  }, [childCount]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || childCount <= 1) return;

    const start = () => {
      autoPlayRef.current = setInterval(() => {
        if (isUserScrolling.current) return;
        setActiveIndex((prev) => {
          const next = (prev + 1) % childCount;
          scrollToIndex(next);
          return next;
        });
      }, autoPlayInterval);
    };

    start();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, autoPlayInterval, childCount, scrollToIndex]);

  // Pause auto-play on user interaction
  const handleTouchStart = () => {
    isUserScrolling.current = true;
  };
  const handleTouchEnd = () => {
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000);
  };

  return (
    <div className={cn('lg:hidden', className)}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 px-1"
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            className={cn(
              'snap-center shrink-0',
              widthMap[itemWidth],
              itemClassName
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {showDots && childCount > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: childCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollToIndex(i);
                setActiveIndex(i);
              }}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'h-2 w-6'
                  : 'h-2 w-2'
              )}
              style={{
                background:
                  i === activeIndex ? 'var(--accent-primary)' : 'rgba(164, 77, 63, 0.24)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
