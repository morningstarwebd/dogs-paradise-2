'use client';

import React, { useMemo, useState, type ReactNode, forwardRef, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import dynamic from 'next/dynamic';
import type { Testimonial } from '@/types';

// @ts-ignore
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImagePlus,
  Sparkles,
  Star,
} from 'lucide-react';

type BookPage =
  | {
      id: string;
      type: 'story';
      testimonial: Testimonial;
    }
  | {
      id: string;
      type: 'photo';
      imageUrl: string;
      label: string;
    }
  | {
      id: string;
      type: 'placeholder';
      label: string;
      note: string;
    };

interface HappyCustomersBookProps {
  testimonials: Testimonial[];
  familyPlaceholders: string[];
}

export default function HappyCustomersBook({
  testimonials,
  familyPlaceholders,
}: HappyCustomersBookProps) {
  const pages = useMemo<BookPage[]>(() => {
    const storyPages: BookPage[] = testimonials.map((testimonial) => ({
      id: testimonial.id,
      type: 'story',
      testimonial,
    }));

    const photoPages: BookPage[] = Array.from({ length: 22 }).map((_, i) => {
      const num = String(i + 1).padStart(2, '0');
      return {
        id: `photo-${num}`,
        type: 'photo',
        imageUrl: `/images/families/family-${num}.jpeg`,
        label: `Happy Family Moment`,
      };
    });

    const combined: BookPage[] = [];
    const maxLength = Math.max(storyPages.length, photoPages.length);
    for (let i = 0; i < maxLength; i++) {
       if (storyPages[i]) combined.push(storyPages[i]);
       if (photoPages[i]) combined.push(photoPages[i]);
    }

    if (combined.length % 2 !== 0) {
      combined.push({
        id: 'placeholder-ending',
        type: 'placeholder',
        label: 'More Family Memories',
        note: 'Keep adding new customer stories, family pictures, and celebration moments here.',
      });
    }

    return combined;
  }, [familyPlaceholders, testimonials]);

  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState(1);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const bookRef = useRef<any>(null);

  const maxMobileIndex = pages.length - 1;

  const goToMobilePage = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex > maxMobileIndex) {
      return;
    }
    setMobileDirection(nextIndex > mobileIndex ? 1 : -1);
    setMobileIndex(nextIndex);
  };

  const goNextPage = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipNext();
  };

  const goPrevPage = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipPrev();
  };

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <MobileBook
          page={pages[mobileIndex]}
          pageIndex={mobileIndex}
          totalPages={pages.length}
          direction={mobileDirection}
          onPrev={() => goToMobilePage(mobileIndex - 1)}
          onNext={() => goToMobilePage(mobileIndex + 1)}
        />
      </div>

      <div className="hidden lg:block">
        {!isDesktopOpen ? (
          <button
            type="button"
            onClick={() => setIsDesktopOpen(true)}
            className="book-cover group relative mx-auto flex min-h-[420px] w-full max-w-5xl flex-col justify-between overflow-hidden rounded-[36px] px-10 py-12 text-left text-white transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-y-8 left-8 w-4 rounded-full bg-white/14 blur-[2px]" />
            <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full bg-[var(--accent-secondary)]/35 blur-3xl" />

            <div className="relative z-10">
              <span className="label-badge inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/90">
                Happy Customers Book
              </span>
              <h2 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight">
                Open the Memory Book and Flip Through Real Customer Stories
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                Click to open a desktop book spread. Inside, customers can browse real feedback and
                your future family-photo placeholders like turning printed pages.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/85">
                <BookOpen size={20} />
                <span className="text-sm font-medium">Click to open the storybook</span>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                Open Book
              </span>
            </div>
          </button>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  Desktop Storybook
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Click the right page to continue or use the arrows below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDesktopOpen(false)}
                className="glass-btn px-5 py-2 text-sm font-medium"
              >
                Close Book
              </button>
            </div>

            <div className="relative mx-auto flex justify-center max-w-5xl my-10">
              {/* @ts-ignore - types require all props even if they have defaults */}
              <HTMLFlipBook
                width={480}
                height={620}
                size="fixed"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                className="rounded-[24px] overflow-hidden shadow-2xl bg-[#fdfaf5]"
                ref={bookRef}
                usePortrait={false}
              >
                {pages.map((p, i) => (
                  <FlipBookPageNode key={p.id} page={p} index={i} />
                ))}
              </HTMLFlipBook>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrevPage}
                className="glass-btn flex items-center gap-2 px-5 py-3 text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Previous Pages
              </button>
              <span className="text-sm text-[var(--text-secondary)]">
                Flip to browse
              </span>
              <button
                type="button"
                onClick={goNextPage}
                className="glass-btn flex items-center gap-2 px-5 py-3 text-sm font-medium"
              >
                Next Pages
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileBook({
  page,
  pageIndex,
  totalPages,
  direction,
  onPrev,
  onNext,
}: {
  page: BookPage;
  pageIndex: number;
  totalPages: number;
  direction: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-180, 0, 180], [14, 0, -14]);
  const rotateZ = useTransform(dragX, [-180, 0, 180], [-2, 0, 2]);

  return (
    <div className="space-y-5">
      <div className="relative mx-auto max-w-md px-2" style={{ perspective: '1600px' }}>
        <div className="absolute inset-x-6 top-5 h-full rounded-[30px] border border-[var(--color-border)]/50 bg-[var(--accent-secondary)]/8" />
        <div className="absolute inset-x-3 top-2.5 h-full rounded-[30px] border border-[var(--color-border)]/60 bg-[var(--accent-tertiary)]/8" />

        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={page.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 90 : -90, rotateY: direction > 0 ? -18 : 18 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -70 : 70, rotateY: direction > 0 ? 18 : -18 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            style={{ x: dragX, rotateY, rotateZ }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -90) {
                onNext();
              } else if (info.offset.x > 90) {
                onPrev();
              }
            }}
            className="book-shell relative min-h-[460px] overflow-hidden rounded-[30px] px-6 py-6"
          >
            <BookPageView page={page} pageNumber={pageIndex + 1} side="right" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={pageIndex === 0}
          className="glass-btn flex items-center gap-2 px-4 py-2.5 text-sm font-medium disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Page {pageIndex + 1} of {totalPages}
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">Swipe left or right to turn the page</p>
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={pageIndex === totalPages - 1}
          className="glass-btn flex items-center gap-2 px-4 py-2.5 text-sm font-medium disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function BookPageView({
  page,
  pageNumber,
  side,
}: {
  page: BookPage | undefined;
  pageNumber: number;
  side: 'left' | 'right';
}) {
  if (!page) {
    return (
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-sm text-[var(--text-tertiary)]">More stories coming soon.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <span className="label-badge rounded-full border border-[var(--color-border)] bg-white/60 px-3 py-1 text-[var(--text-secondary)]">
          {page.type === 'story' ? 'Happy Customer' : 'Happy Family'}
        </span>
        <span className="text-xs font-medium text-[var(--text-tertiary)]">Page {pageNumber}</span>
      </div>

      {page.type === 'story' ? (
        <StoryPage page={page.testimonial} side={side} />
      ) : page.type === 'photo' ? (
        <PhotoPage imageUrl={page.imageUrl} label={page.label} />
      ) : (
        <PlaceholderPage label={page.label} note={page.note} />
      )}
    </div>
  );
}

function StoryPage({
  page,
  side,
}: {
  page: Testimonial;
  side: 'left' | 'right';
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={index < page.rating ? 'fill-current text-amber-500' : 'text-slate-300'}
          />
        ))}
      </div>

      <div className="mb-5 rounded-[24px] border border-[var(--color-border)] bg-white/72 px-5 py-5 shadow-sm">
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          &ldquo;{page.text}&rdquo;
        </p>
      </div>

      <div className="mt-auto space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoPill icon={<Heart size={14} />} label="Breed" value={page.breedPurchased} />
          <InfoPill icon={<Sparkles size={14} />} label="City" value={page.location} />
        </div>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--accent-primary)]/6 px-5 py-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{page.authorName}</p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Story date: {page.date} {side === 'right' ? '| Tap right side for next pages' : '| Tap left side for previous pages'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
        <ImagePlus size={28} />
      </div>
      <h3 className="heading-card mb-3 text-[var(--text-primary)]">{label}</h3>
      <p className="mx-auto max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
        {note}
      </p>
      <div className="mt-6 rounded-full border border-dashed border-[var(--accent-primary)]/30 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
        Photo-ready placeholder
      </div>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white/65 px-4 py-3">
      <div className="mt-0.5 text-[var(--accent-primary)]">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">{label}</p>
        <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

const FlipBookPageNode = forwardRef<HTMLDivElement, { page: BookPage; index: number }>((props, ref) => {
  return (
    <div ref={ref} className="book-page bg-[#fdfaf5] relative h-full overflow-hidden border border-[var(--color-border)] shadow-sm" style={{ boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.02)' }}>
      <div className="px-9 py-8 h-full">
        <BookPageView page={props.page} pageNumber={props.index + 1} side={props.index % 2 === 0 ? 'left' : 'right'} />
      </div>
    </div>
  );
});
FlipBookPageNode.displayName = 'FlipBookPageNode';

function PhotoPage({ imageUrl, label }: { imageUrl: string; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <div className="relative w-full h-full min-h-[350px] overflow-hidden rounded-[20px] shadow-sm">
        <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}
