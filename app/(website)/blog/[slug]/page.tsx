import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts as fallbackPosts } from "@/data/blog-posts";
import { createStaticClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getPost(slug: string): Promise<BlogPost | null> {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt || "",
            content: data.content || "",
            coverImagePath: data.cover_image || "/images/placeholder.jpg",
            category: data.category || "General",
            readingTime: `${data.reading_time || 5} min read`,
            publishedAt: new Date(data.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            author: "Admin",
            seoTitle: data.title,
            seoDescription: data.excerpt || "",
        };
    } catch {
        return null;
    }
}

async function getRelatedPosts(category: string, excludeId: string): Promise<BlogPost[]> {
    try {
        const supabase = createStaticClient();
        const { data } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("published", true)
            .eq("category", category)
            .neq("id", excludeId)
            .order("created_at", { ascending: false })
            .limit(3);

        if (!data || data.length === 0) return [];
        return data.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            excerpt: d.excerpt || "",
            content: d.content || "",
            coverImagePath: d.cover_image || "/images/placeholder.jpg",
            category: d.category || "General",
            readingTime: `${d.reading_time || 5} min read`,
            publishedAt: new Date(d.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            author: "Admin",
            seoTitle: d.title,
            seoDescription: d.excerpt || "",
        }));
    } catch {
        return [];
    }
}

export async function generateStaticParams() {
  return fallbackPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post = await getPost(slug);
  if (!post) post = fallbackPosts.find((p) => p.slug === slug) || null;
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.coverImagePath, width: 1200, height: 675 }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post = await getPost(slug);
  let relatedPosts: BlogPost[] = [];

  if (post) {
      relatedPosts = await getRelatedPosts(post.category, post.id);
      if (relatedPosts.length === 0) {
          relatedPosts = fallbackPosts.filter((p) => p.id !== post?.id && p.category === post?.category).slice(0, 3);
      }
  } else {
      post = fallbackPosts.find((p) => p.slug === slug) || null;
      if (!post) notFound();
      relatedPosts = fallbackPosts.filter((p) => p.id !== post?.id && p.category === post?.category).slice(0, 3);
  }

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
