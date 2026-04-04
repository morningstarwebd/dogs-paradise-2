'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { blogPosts } from '@/data/blog-posts';
import { ArrowRight, Clock } from 'lucide-react';

const featured = blogPosts.slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="section-shell section-solid-rose" id="blog-preview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="From Our Blog"
          subtitle="Expert guides, breed comparisons, and puppy care tips from the Dogs Paradise Bangalore team."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <motion.div variants={fadeUpVariant} className="lg:col-span-7">
            <Link href={`/blog/${featured[0].slug}`} className="group block h-full">
              <div className="h-full overflow-hidden rounded-2xl border border-rose-100/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden lg:h-64 lg:aspect-auto">
                  <Image
                    src={featured[0].coverImagePath}
                    alt={featured[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="label-badge inline-flex rounded-full border border-white bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      {featured[0].category}
                    </span>
                  </div>
                </div>
                <div className="relative z-10 p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featured[0].readingTime}
                    </span>
                    <span>/</span>
                    <span>{featured[0].publishedAt}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-display font-bold text-slate-900 transition-colors group-hover:text-rose-600">
                    {featured[0].title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {featured[0].excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {featured.slice(1).map((post) => (
              <motion.div key={post.id} variants={fadeUpVariant} className="flex-1">
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-rose-100/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row lg:flex-col">
                    <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:w-48 sm:aspect-auto lg:h-32 lg:w-full">
                      <Image
                        src={post.coverImagePath}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    </div>
                    <div className="relative z-10 flex-1 p-4">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <span className="rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 uppercase tracking-wider text-rose-600">
                          {post.category}
                        </span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="line-clamp-2 text-sm font-display font-bold text-slate-900 transition-colors group-hover:text-rose-600">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/blog"
            className="glass-btn inline-flex items-center gap-2 px-8 py-3 text-sm font-medium"
          >
            View All Articles
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
