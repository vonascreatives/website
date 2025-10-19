import React from "react";
import { Metadata } from "next";
import AffiliateLinksMain from "@/_pages/affiliate-links/affiliate-links-main";
import { getAffiliateLinksData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Affiliate Links - Vonas Media",
  description: "Explore our curated collection of affiliate partnerships and collaborative projects.",
};

const AffiliateLinksPage = async () => {
  const affiliateLinks = await getAffiliateLinksData();
  
  return (
    <AffiliateLinksMain initialAffiliateLinks={affiliateLinks} />
  );
};

export default AffiliateLinksPage;
