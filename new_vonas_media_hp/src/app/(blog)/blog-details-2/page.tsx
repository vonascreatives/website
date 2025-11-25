import React from "react";
import { Metadata } from "next";
import BlogDetailsTwoMain from "@/_pages/blog/blog-details-2";
import { getOperationsManager } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Liko - Blog Details 2 page",
};

const BlogDetailsTwoPage = async () => {
  // Fetch Operations Manager for author section
  const operationsManager = await getOperationsManager();

  return (
    <BlogDetailsTwoMain operationsManager={operationsManager} />
  );
};

export default BlogDetailsTwoPage;
