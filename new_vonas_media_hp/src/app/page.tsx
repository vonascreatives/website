import { Metadata } from "next";
import HomeOnePage from "./(homes)/home-1/page";
import { generateOrganizationSchema, generateWebsiteSchema, StructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Vonas Media - Content Channel Lab | Digital Success Stories",
  description: "Building digital success stories through content creation and channel management. Discover top creators, exclusive content, and innovative digital strategies that drive engagement and growth.",
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <HomeOnePage />
    </>
  );
}
