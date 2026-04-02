'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { fadeUpVariant, cardHoverVariant } from '@/lib/animations';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div variants={cardHoverVariant} initial="rest" whileHover="hover">
        <Link
          href={`/blog/${post.slug}`}
          className="glass-card block group overflow-hidden h-full"
          id={`blog-card-${post.id}`}
        >
          {/* Cover Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImagePath}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-3 left-3 z-10">
              <span className="label-badge inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 relative z-10">
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime}
              </span>
              <span>·</span>
              <span>{post.publishedAt}</span>
            </div>
            <h3 className="heading-card text-gradient mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors inline-flex items-center gap-1">
              Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
