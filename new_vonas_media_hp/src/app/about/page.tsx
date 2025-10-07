import React from "react";
import { Metadata } from "next";
import AboutUsMain from "@/pages/about/about-us";
import { getAboutData, getTeamMembersData, getAboutPageImages, getBrandCollaborationData } from "@/lib/sanity";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us - Vonas Media",
  description: "Learn about Vonas Media's mission to build digital success stories through content creation and channel management. Meet our team and discover our approach to creator partnerships.",
  keywords: ['about vonas media', 'content creation company', 'digital marketing agency', 'creator partnerships', 'channel management'],
  url: `${SEO_DEFAULTS.siteUrl}/about`,
  type: 'website',
});

const AboutPage = async () => {
  const aboutData = await getAboutData();
  const teamMembers = await getTeamMembersData();
  const aboutPageImages = await getAboutPageImages();
  const brandCollaborations = await getBrandCollaborationData();
  
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <StructuredData data={organizationSchema} />
      <AboutUsMain 
        aboutData={aboutData} 
        teamMembers={teamMembers}
        aboutPageImages={aboutPageImages}
        brandCollaborations={brandCollaborations}
      />
    </>
  );
};

export default AboutPage;
