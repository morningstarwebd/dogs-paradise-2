'use client';

import { motion } from 'motion/react';
import BlogCard from '@/components/blog/BlogCard';
import { staggerContainer } from '@/lib/animations';
import type { BlogPost } from '@/types';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} index={i} />
      ))}
    </motion.div>
  );
}
