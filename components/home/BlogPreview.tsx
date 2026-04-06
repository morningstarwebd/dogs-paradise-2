'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { blogPosts } from '@/data/blog-posts';
import { ArrowRight, Clock } from 'lucide-react';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';
import { toStorageOnlyImage } from '@/lib/storage-only-images';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type BlogCardItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  url: string;
  image: string;
  featured: boolean;
};

type SectionDesignProps = {
  heading?: string;
  subheading?: string;
  view_all_text?: string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
};

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function buildBlogCards(blocks: RawBlock[]): BlogCardItem[] {
  return blocks
    .filter((block) => block?.type === 'blog_card' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `blog_card_${index}`,
        title: toText(settings.title, `Blog Post ${index + 1}`),
        excerpt: toText(settings.excerpt, 'Learn more from Dogs Paradise blog.'),
        category: toText(settings.category, 'Blog'),
        readingTime: toText(settings.reading_time, '5 min read'),
        publishedAt: toText(settings.published_at, 'Recently'),
        url: toText(settings.url, '/blog'),
        image: toStorageOnlyImage(settings.image),
        featured: Boolean(settings.featured),
      };
    });
}

export default function BlogPreview({
  heading = 'From Our Blog',
  subheading = 'Expert guides, breed comparisons, and puppy care tips from the Dogs Paradise Bangalore team.',
  view_all_text = 'View All Articles',
  blocks = [],
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: SectionDesignProps) {
  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color);

  const blockCards = buildBlogCards(blocks);
  const fallbackCards: BlogCardItem[] = blogPosts.slice(0, 6).map((post, index) => ({
    id: post.id || `fallback_blog_${index}`,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt,
    url: `/blog/${post.slug}`,
    image: post.coverImagePath,
    featured: index === 0,
  }));

  const cards = blockCards.length > 0 ? blockCards : fallbackCards;
  if (cards.length === 0) {
    return null;
  }
  const featuredCard = cards.find((card) => card.featured) || cards[0];
  const sideCards = cards.filter((card) => card.id !== featuredCard.id).slice(0, 2);

  return (
    <section className="section-shell section-solid-rose" id="blog-preview" style={sectionStyle}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={heading}
          subtitle={subheading}
          useGradientTitle={!sectionTextColor}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <motion.div variants={fadeUpVariant} className="lg:col-span-7">
            <Link href={featuredCard.url} className="group block h-full">
              <div className="h-full overflow-hidden rounded-2xl border border-rose-100/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden lg:h-64 lg:aspect-auto">
                  <Image
                    src={featuredCard.image}
                    alt={featuredCard.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="label-badge inline-flex rounded-full border border-white bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      {featuredCard.category}
                    </span>
                  </div>
                </div>
                <div className="relative z-10 p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredCard.readingTime}
                    </span>
                    <span>/</span>
                    <span>{featuredCard.publishedAt}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-display font-bold text-slate-900 transition-colors group-hover:text-rose-600">
                    {featuredCard.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {featuredCard.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {sideCards.map((post) => (
              <motion.div key={post.id} variants={fadeUpVariant} className="flex-1">
                <Link href={post.url} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-rose-100/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row lg:flex-col">
                    <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:w-48 sm:aspect-auto lg:h-32 lg:w-full">
                      <Image
                        src={post.image}
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
            {view_all_text}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
