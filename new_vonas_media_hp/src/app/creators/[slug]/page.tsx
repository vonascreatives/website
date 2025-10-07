import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CreatorDetailMain from "@/components/creator-detail/creator-detail-main";
import { getCreatorBySlug, sanityClient } from "@/lib/sanity";
import { getCreatorFollowerCount, formatFollowers } from "@/utils/formatFollowers";
import { generateMetadata as generateSEOMetadata, generatePersonSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

interface CreatorDetailPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all creators
export async function generateStaticParams() {
  if (!sanityClient) return [];
  
  try {
    const creators = await sanityClient.fetch(`*[_type == "exclusiveCreator"].slug.current`);
    return creators.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating creator params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: CreatorDetailPageProps): Promise<Metadata> {
  const creator = await getCreatorBySlug(params.slug);
  
  if (!creator) {
    return {
      title: "Creator Not Found - Vonas Media",
      description: "The requested creator profile could not be found.",
    };
  }

  const followerCount = getCreatorFollowerCount(creator);
  const formattedFollowers = formatFollowers(followerCount);
  const bioText = creator.bio?.[0]?.children?.[0]?.text || creator.headline || '';
  const description = bioText || `Connect with ${creator.name}, a talented content creator with ${formattedFollowers} followers. Discover their exclusive content and creative work.`;
  
  const creatorImage = creator.heroImage?.url || creator.profileImage?.url || SEO_DEFAULTS.defaultImage;
  const creatorUrl = `${SEO_DEFAULTS.siteUrl}/creators/${params.slug}`;
  
  const keywords = [
    creator.name,
    'content creator',
    'influencer',
    ...(creator.categories || []),
    ...SEO_DEFAULTS.defaultKeywords
  ];

  return generateSEOMetadata({
    title: `${creator.name} - Content Creator`,
    description,
    keywords,
    image: creatorImage,
    url: creatorUrl,
    type: 'profile',
    author: creator.name,
  });
}

const CreatorDetailPage = async ({ params }: CreatorDetailPageProps) => {
  const creator = await getCreatorBySlug(params.slug);
  
  if (!creator) {
    notFound();
  }
  
  const personSchema = generatePersonSchema(creator);
  
  return (
    <>
      {personSchema && <StructuredData data={personSchema} />}
      <CreatorDetailMain creator={creator} />
    </>
  );
};

export default CreatorDetailPage;
