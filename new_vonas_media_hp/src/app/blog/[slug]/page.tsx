import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailMain from "@/_pages/blog/blog-detail-main";
import { getNewsArticleBySlug, getNewsData, sanityClient } from "@/lib/sanity";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  if (!sanityClient) return [];
  
  try {
    const posts = await getNewsData();
    return posts.map((post: any) => ({
      slug: post.slug?.current || '',
    })).filter((p: any) => p.slug);
  } catch (error) {
    console.error('Error generating blog params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsArticleBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found - Vonas Media",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - Vonas Media Blog`,
    description: post.excerpt || `Read ${post.title} on Vonas Media Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.heroImage ? [{ url: post.heroImage }] : [],
    },
  };
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;
  const post = await getNewsArticleBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return <BlogDetailMain post={post} />;
};

export default BlogDetailPage;
