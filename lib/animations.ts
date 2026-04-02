import type { Variant, Variants } from 'motion/react';

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 } as Variant,
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  } as Variant,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const cardHoverVariant: Variants = {
  rest: { scale: 1 } as Variant,
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  } as Variant,
};

export const glassReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(8px)',
  } as Variant,
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5 },
  } as Variant,
};

export const fadeInVariant: Variants = {
  hidden: { opacity: 0 } as Variant,
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  } as Variant,
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 } as Variant,
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  } as Variant,
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 } as Variant,
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  } as Variant,
};
