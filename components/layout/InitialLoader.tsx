'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if previously loaded to skip animation
    if (sessionStorage.getItem('site_loaded') === 'true') {
      setIsLoading(false);
      return;
    }

    // Lock body scroll during animation
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('site_loaded', 'true');
      document.body.style.overflow = 'unset';
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-[var(--color-surface)]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 shadow-2xl"
        >
          <div className="overflow-hidden mb-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-wrap justify-center items-center gap-2 md:gap-3 text-5xl sm:text-6xl md:text-7xl font-display font-medium text-[var(--text-primary)] tracking-tight"
            >
              <span>Dogs</span>
              <span className="text-amber-500 italic">Paradise</span>
            </motion.div>
          </div>
          
          <div className="overflow-hidden mb-12 w-full px-4 text-center">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="text-[var(--text-secondary)] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-sm"
            >
              Premium Puppies • Bangalore
            </motion.p>
          </div>

          <motion.div 
            className="absolute bottom-12 md:bottom-16 w-[80%] max-w-[256px] h-[3px] bg-slate-200 overflow-hidden rounded-full shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
