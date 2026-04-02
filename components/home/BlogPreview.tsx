'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { blogPosts } from '@/data/blog-posts';
import { Clock, ArrowRight } from 'lucide-react';

const featured = blogPosts.slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--color-surface)]" id="blog-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="From Our Blog"
          subtitle="Expert guides, breed comparisons, and puppy care tips from the Dogs Paradice team."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Featured Post (large) */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-7">
            <Link href={`/blog/${featured[0].slug}`} className="block group h-full">
              <div className="glass-card overflow-hidden h-full">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-64 overflow-hidden">
                  <Image
                    src={featured[0].coverImagePath}
                    alt={featured[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="label-badge inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 mb-2">
                      {featured[0].category}
                    </span>
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3">
                    <span className="flex items-center gap-1"><Clock size={12} />{featured[0].readingTime}</span>
                    <span>·</span>
                    <span>{featured[0].publishedAt}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-gradient mb-2">
                    {featured[0].title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                    {featured[0].excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side Posts (stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {featured.slice(1).map((post) => (
              <motion.div key={post.id} variants={fadeUpVariant} className="flex-1">
                <Link href={`/blog/${post.slug}`} className="block group h-full">
                  <div className="glass-card overflow-hidden h-full flex flex-col sm:flex-row lg:flex-col">
                    <div className="relative aspect-[16/9] sm:aspect-auto sm:w-48 lg:w-full lg:h-32 shrink-0 overflow-hidden">
                      <Image
                        src={post.coverImagePath}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    </div>
                    <div className="p-4 relative z-10 flex-1">
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)] mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-[var(--color-border)]">{post.category}</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="text-sm font-display font-semibold text-gradient line-clamp-2 group-hover:opacity-80 transition-opacity">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/blog"
            className="glass-btn px-8 py-3 text-sm font-medium inline-flex items-center gap-2"
          >
            View All Articles
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
