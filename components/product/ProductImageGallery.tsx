'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import type { Dog as DogType } from '@/types';
import type { PageTemplateSettings, ProductTemplateBlock } from '@/types/page-template';

// Dynamically import HTMLFlipBook since it's a client-only library with potential DOM requirements
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

interface ProductImageGalleryProps {
  dog: DogType;
  block: ProductTemplateBlock;
  styling: PageTemplateSettings['styling'];
}

export default function ProductImageGallery({ dog, block, styling }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const flipBookRef = useRef<any>(null);

  // ... rest of logic ...
  // Robust deduplication of images while preserving order
  const images = useMemo(() => {
    const all = [dog.thumbnailImage, ...dog.images].filter(Boolean) as string[];
    const unique: string[] = [];
    const seen = new Set<string>();

    all.forEach(url => {
      const normalized = url.trim().toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(url);
      }
    });
    return unique;
  }, [dog.thumbnailImage, dog.images]);

  const maxThumbnails = (block.settings.max_thumbnails as number) || 4;
  const showThumbnails = block.settings.show_thumbnails !== false;
  const showBadge = block.settings.show_status_badge !== false;
  const aspectRatio = (block.settings.aspect_ratio as string) || '4:3';
  const showNav = block.settings.show_nav_arrows !== false;
  const autoplay = block.settings.autoplay === true;
  const autoplaySpeed = (block.settings.autoplay_speed as number || 5) * 1000;
  const galleryStyle = (block.settings.gallery_style as string) || 'rounded';
  const animationStyle = block.settings.reduced_motion
    ? 'fade'
    : (block.settings.animation_style as string) || 'cinematic';
  const imageFit = (block.settings.image_fit as string) || 'cover';

  // Animation Variants for each style (excluding book-flip which is handled by its own engine)
  const animationVariants = {
    cinematic: {
      initial: { opacity: 0, scale: 1.15, filter: 'blur(12px)', rotate: 1 },
      animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        rotate: 0,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      },
      exit: { opacity: 0, scale: 0.92, filter: 'blur(8px)', rotate: -1, transition: { duration: 0.8 } }
    },
    slide: {
      initial: { x: '100%', opacity: 0, scale: 1 },
      animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } },
      exit: { x: '-20%', opacity: 0, scale: 0.95, transition: { duration: 0.6 } }
    },
    'v-slide': {
      initial: { y: '100%', opacity: 0, scale: 1 },
      animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } },
      exit: { y: '-20%', opacity: 0, scale: 0.95, transition: { duration: 0.6 } }
    },
    '3d-flip': {
      initial: { rotateY: 90, opacity: 0, scale: 0.8, perspective: 1000 },
      animate: { rotateY: 0, opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
      exit: { rotateY: -90, opacity: 0, scale: 0.8, transition: { duration: 1.0 } }
    },
    parallax: {
      initial: { x: '100%', opacity: 0, scale: 1.2, filter: 'brightness(1.5)' },
      animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: 'brightness(1)',
        transition: {
          duration: 1.0,
          ease: [0.33, 1, 0.68, 1],
          filter: { duration: 1.2 }
        }
      },
      exit: { x: '-10%', opacity: 0, scale: 0.85, transition: { duration: 0.8 } }
    },
    'ken-burns': {
      initial: { opacity: 0, scale: 1 },
      animate: {
        opacity: 1,
        scale: [1, 1.15],
        transition: {
          opacity: { duration: 1.5 },
          scale: { duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }
        }
      },
      exit: { opacity: 0, transition: { duration: 1.5 } }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 1.0 } },
      exit: { opacity: 0, transition: { duration: 0.8 } }
    }
  };

  const currentVariant = animationVariants[animationStyle as keyof typeof animationVariants] || animationVariants.cinematic;

  const aspectClass =
    aspectRatio === '3:4' ? 'aspect-[3/4]' :
      aspectRatio === '1:1' ? 'aspect-square' :
        aspectRatio === '16:9' ? 'aspect-video' :
          'aspect-[4/3]';

  // Apply gallery style based on setting
  const radius =
    galleryStyle === 'square' ? 'rounded-none' :
      galleryStyle === 'pill' ? 'rounded-3xl' :
        styling?.border_radius === 'none' ? 'rounded-none' :
          styling?.border_radius === 'md' ? 'rounded-md' :
            styling?.border_radius === 'xl' ? 'rounded-xl' :
              styling?.border_radius === '3xl' ? 'rounded-3xl' :
                'rounded-2xl';

  // For Book Flip looping, we create a wrapped array [Last, 1, 2, 3, First]
  const bookImages = useMemo(() => {
    if (images.length < 2) return images;
    return [images[images.length - 1], ...images, images[0]];
  }, [images]);

  const nextImage = useCallback(() => {
    if (animationStyle === 'book-flip' && flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    } else {
      setSelectedIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length, animationStyle]);

  const prevImage = useCallback(() => {
    if (animationStyle === 'book-flip' && flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    } else {
      setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length, animationStyle]);

  // Handle external setting of selected index (thumbnails)
  const jumpToIndex = (idx: number) => {
    if (animationStyle === 'book-flip' && flipBookRef.current) {
      // Map real index to book index (offset by 1)
      flipBookRef.current.pageFlip().flip(idx + 1);
    } else {
      setSelectedIndex(idx);
    }
  };

  useEffect(() => {
    if (!autoplay || isPaused || images.length <= 1 || showLightbox) return;

    const interval = setInterval(nextImage, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, isPaused, images.length, nextImage, showLightbox]);

  // Sync selection across engines
  const handleFlip = useCallback((e: any) => {
    const p = e.data;
    if (p === 0) {
      // We hit the left buffer (Last image clone), jump silently to the real last image
      setTimeout(() => flipBookRef.current?.pageFlip().turnToPage(images.length), 100);
      setSelectedIndex(images.length - 1);
    } else if (p === bookImages.length - 1) {
      // We hit the right buffer (First image clone), jump silently to the real first image
      setTimeout(() => flipBookRef.current?.pageFlip().turnToPage(1), 100);
      setSelectedIndex(0);
    } else {
      setSelectedIndex(p - 1);
    }
  }, [images.length, bookImages.length]);

  // Track container dimensions to force single-page mode effectively
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight || w * (aspectRatio === '3:4' ? 1.33 : aspectRatio === '16:9' ? 0.56 : 0.75);
        setDimensions({ width: w, height: h });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [aspectRatio]);

  return (
    <>
      <div
        className="space-y-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className={`relative ${aspectClass} ${radius} overflow-hidden group bg-gray-100 shadow-sm transition-all duration-500 cursor-zoom-in`}
          onClick={() => setShowLightbox(true)}
        >
          {/* Navigation Arrows for Main Image */}
          {showNav && images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Main Image Rendering Engine */}
          <div className="relative h-full w-full bg-black/5 overflow-hidden flex items-center justify-center">
            {animationStyle === 'book-flip' ? (
              /* Pro-Level Book Flip Engine with Strict Single-Page Logic */
              <HTMLFlipBook
                ref={flipBookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="fixed"
                minWidth={100}
                maxWidth={2500}
                minHeight={100}
                maxHeight={2500}
                maxShadowOpacity={0.4}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={true}
                startPage={1}
                drawShadow={true}
                flippingTime={1000}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                style={{ margin: '0 auto' }}
                onFlip={handleFlip}
                className="mx-auto"
              >
                {bookImages.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative h-full w-full bg-white overflow-hidden">
                    <Image
                      src={img}
                      alt={`Page ${idx}`}
                      fill
                      quality={90}
                      className={imageFit === 'contain' ? 'object-contain' : 'object-cover'}
                      sizes="(max-width: 1024px) 100vw, 80vw"
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            ) : (
              /* Standard High-End Animations */
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={images[selectedIndex]}
                  initial={currentVariant.initial}
                  animate={currentVariant.animate}
                  exit={currentVariant.exit}
                  className="absolute inset-0 h-full w-full"
                >
                  <Image
                    src={images[selectedIndex]}
                    alt={`${dog.breedName} photo ${selectedIndex + 1}`}
                    fill
                    priority
                    className={imageFit === 'contain' ? 'object-contain' : 'object-cover'}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Subtle overlay glow during transition */}
                  {animationStyle === 'cinematic' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 1.4 }}
                      className="absolute inset-0 bg-white pointer-events-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>


          {/* Overlays */}
          {styling?.show_gradients && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          )}

          {showBadge && (
            <div className="absolute top-4 left-4 z-10">
              <Badge status={dog.status} />
            </div>
          )}

          {dog.featured && (
            <div className="absolute top-4 right-4 z-10 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg border border-white/20">
              Premium
            </div>
          )}

          {/* Image Progress Indicator (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); jumpToIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails Grid */}
        {showThumbnails && images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2.5">
            {images.slice(0, maxThumbnails).map((img, idx) => (
              <button
                key={img}
                onClick={() => jumpToIndex(idx)}
                className={`relative aspect-square ${radius} overflow-hidden cursor-pointer transition-all duration-300 transform ${idx === selectedIndex
                  ? 'ring-2 ring-offset-2 ring-[#ea728c] scale-[0.98]'
                  : 'hover:opacity-80 hover:scale-[1.02]'
                  }`}
              >
                <Image
                  src={img}
                  alt={`${dog.breedName} thumb ${idx + 1}`}
                  fill
                  className={`object-cover transition-transform duration-500 ${idx === selectedIndex ? 'scale-110' : ''
                    }`}
                  sizes="(max-width: 1024px) 25vw, 12vw"
                />
                {idx === selectedIndex && (
                  <div className="absolute inset-0 bg-[#ea728c]/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setShowLightbox(false)}
          >
            <button
              className="absolute top-6 right-6 z-20 text-white/50 hover:text-white transition-colors"
              onClick={() => setShowLightbox(false)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-full w-full max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl shadow-white/5">
                <Image
                  src={images[selectedIndex]}
                  alt={`${dog.breedName} full view`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium tracking-widest uppercase">
                Image {selectedIndex + 1} of {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
