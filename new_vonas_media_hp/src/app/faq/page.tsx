import React from "react";
import { Metadata } from "next";
import FaqMain from "@/_pages/faq/faq-main";
import { getFaqData } from "@/lib/sanity";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Frequently Asked Questions - Vonas Media",
  description: "Find answers to common questions about Vonas Media's content creation services, channel management, creator partnerships, and digital marketing solutions.",
  keywords: ['vonas media faq', 'content creation questions', 'channel management help', 'creator partnership info', 'digital marketing faq'],
  url: `${SEO_DEFAULTS.siteUrl}/faq`,
  type: 'website',
});

const FaqPage = async () => {
  const faqData = await getFaqData();
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <StructuredData data={organizationSchema} />
      <FaqMain initialFaqData={faqData} />
    </>
  );
};

export default FaqPage;
