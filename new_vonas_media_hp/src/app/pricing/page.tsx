import React from "react";
import { Metadata } from "next";
import PricingMain from "@/pages/pricing/pricing-main";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing - Vonas Media",
  description: "Explore Vonas Media's competitive pricing for content creation services, channel management, and digital marketing solutions. Find the perfect plan for your creator journey.",
  keywords: ['vonas media pricing', 'content creation costs', 'channel management pricing', 'digital marketing rates', 'creator services pricing'],
  url: `${SEO_DEFAULTS.siteUrl}/pricing`,
  type: 'website',
});

const PricingPage = () => {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <StructuredData data={organizationSchema} />
      <PricingMain/>
    </>
  );
};

export default PricingPage;
