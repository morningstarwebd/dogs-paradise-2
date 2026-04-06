import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogGrid from "@/components/blog/BlogGrid";
import { blogPosts as fallbackPosts } from "@/data/blog-posts";
import { createStaticClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Expert tips on dog care, breed guides, puppy training, and more. Read the Dogs Paradise Bangalore blog for everything you need to know about dogs in India.",
};

export const revalidate = 60;

async function getPosts(): Promise<BlogPost[]> {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
            return fallbackPosts;
        }

        return data.map((post: any) => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || "",
            content: post.content || "",
            coverImagePath: post.cover_image || "/images/placeholder.jpg",
            category: post.category || "General",
            readingTime: `${post.reading_time || 5} min read`,
            publishedAt: new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            author: "Admin",
            seoTitle: post.title,
            seoDescription: post.excerpt || "",
        }));
    } catch {
        return fallbackPosts;
    }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Blog"
          subtitle="Expert guides, breed comparisons, and puppy care tips from the Dogs Paradise Bangalore team."
        />
        <BlogGrid posts={posts} />
      </div>
    </div>
  );
}
