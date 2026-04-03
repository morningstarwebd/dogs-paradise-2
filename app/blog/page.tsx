import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogGrid from '@/components/blog/BlogGrid';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Expert tips on dog care, breed guides, puppy training, and more. Read the Dogs Paradise Bangalore blog for everything you need to know about dogs in India.',
};

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Blog"
          subtitle="Expert guides, breed comparisons, and puppy care tips from the Dogs Paradise Bangalore team."
        />
        <BlogGrid posts={blogPosts} />
      </div>
    </div>
  );
}
