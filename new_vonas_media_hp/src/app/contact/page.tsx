import React from "react";
import { Metadata } from "next";
import ContactMain from "@/_pages/contact/contact";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Vonas Media",
  description: "Get in touch with Vonas Media for content creation partnerships, channel management services, and digital marketing solutions. Let's build your digital success story together.",
  keywords: ['contact vonas media', 'content creation partnership', 'channel management inquiry', 'digital marketing consultation', 'creator collaboration'],
  url: `${SEO_DEFAULTS.siteUrl}/contact`,
  type: 'website',
});

const ContactPage = () => {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <StructuredData data={organizationSchema} />
      <ContactMain/>
    </>
  );
};

export default ContactPage;
