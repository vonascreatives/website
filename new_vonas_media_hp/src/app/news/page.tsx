import React from "react";
import { Metadata } from "next";
import BlogClassicMain from "@/pages/blog/blog-classic";
import { getNewsData } from "@/lib/sanity";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "News & Updates - Vonas Media",
  description: "Stay updated with the latest news, insights, and updates from Vonas Media. Discover industry trends, creator success stories, and digital marketing tips.",
  keywords: ['vonas media news', 'content creation updates', 'digital marketing insights', 'creator industry news', 'channel management tips'],
  url: `${SEO_DEFAULTS.siteUrl}/news`,
  type: 'website',
});

const NewsPage = async ({ searchParams }: { searchParams: { category?: string } }) => {
  let articles = await getNewsData();
  
  // Filter by category if provided
  if (searchParams.category) {
    articles = articles.filter((article: any) => 
      article.categories?.includes(searchParams.category)
    );
  }
  
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <StructuredData data={organizationSchema} />
      <BlogClassicMain blogs={articles} />
    </>
  );
};

export default NewsPage;
