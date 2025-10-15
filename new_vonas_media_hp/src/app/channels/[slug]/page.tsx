import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioDetailsCustomLightMain from "@/pages/portfolio/details/portfolio-custom-light-main";
import { getYouTubeChannelById, getChannelNavigation, sanityClient } from "@/lib/sanity";
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

interface ChannelDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all channels
export async function generateStaticParams() {
  if (!sanityClient) return [];
  
  try {
    const channels = await sanityClient.fetch(`*[_type == "youtubeChannel"].channelId`);
    return channels.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating channel params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ChannelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const channel = await getYouTubeChannelById(slug);
  
  if (!channel) {
    return {
      title: "Channel Not Found - Vonas Media",
      description: "The requested YouTube channel could not be found.",
    };
  }

  const description = channel.description || `Discover ${channel.title}, a YouTube channel featuring engaging content and creative videos. Subscribe for the latest updates and exclusive content.`;
  const channelImage = channel.thumbnails?.high?.url || channel.thumbnails?.default?.url || SEO_DEFAULTS.defaultImage;
  const channelUrl = `${SEO_DEFAULTS.siteUrl}/channels/${slug}`;
  
  const keywords = [
    channel.title,
    'YouTube channel',
    'video content',
    'content creator',
    ...SEO_DEFAULTS.defaultKeywords
  ];

  return generateSEOMetadata({
    title: `${channel.title} - YouTube Channel`,
    description,
    keywords,
    image: channelImage,
    url: channelUrl,
    type: 'website',
    author: channel.title,
  });
}

const ChannelDetailPage = async ({ params }: ChannelDetailPageProps) => {
  const { slug } = await params;
  const [youtubeChannel, navigation] = await Promise.all([
    getYouTubeChannelById(slug),
    getChannelNavigation(slug)
  ]);
  
  // If no channel found, show 404
  if (!youtubeChannel) {
    notFound();
  }

  // Generate structured data for the channel
  const channelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: youtubeChannel.title,
    description: youtubeChannel.description,
    url: `${SEO_DEFAULTS.siteUrl}/channels/${slug}`,
    logo: youtubeChannel.thumbnails?.high?.url || youtubeChannel.thumbnails?.default?.url,
    sameAs: [`https://www.youtube.com/channel/${slug}`],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Vonas Media'
    }
  };
  
  return (
    <>
      <StructuredData data={channelSchema} />
      <PortfolioDetailsCustomLightMain 
        channel={youtubeChannel} 
        navigation={navigation}
      />
    </>
  );
};

export default ChannelDetailPage;
