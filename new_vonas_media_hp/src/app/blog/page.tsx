import React from "react";
import { Metadata } from "next";
import BlogMain from "@/_pages/blog/blog-main";
import { getNewsData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Blog - Vonas Media",
  description: "Read the latest news, insights, and stories from Vonas Media. Stay updated on content creation, creator economy, and digital media trends.",
};

const BlogPage = async () => {
  const posts = await getNewsData();
  
  return (
    <BlogMain posts={posts} />
  );
};

export default BlogPage;
