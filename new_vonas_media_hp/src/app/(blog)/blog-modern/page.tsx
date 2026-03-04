import React from "react";
import { Metadata } from "next";
import BlogModernMain from "@/_pages/blog/blog-modern";
import { getNewsData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Liko - Blog Modern page",
};

// Revalidate every 60 seconds so new posts appear without a full deploy
export const revalidate = 60;

const BlogModernPage = async () => {
  const posts = await getNewsData();
  return (
    <BlogModernMain posts={posts} />
  );
};

export default BlogModernPage;
