import React from "react";
import { Metadata } from "next";
import HomeMain from "@/pages/homes/home-1";
import { 
  getChannelsData, 
  getCreatorsData, 
  getBrandCollaborationData,
  getYouTubeChannelsForHomepage,
  getHomepageImages,
  getAwardsData
} from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Home",
};

const Home = async () => {
  // Fetch all homepage data
  const [channels, creators, brands, youtubeChannels, homepageImages, awards] = await Promise.all([
    getChannelsData(),
    getCreatorsData(),
    getBrandCollaborationData(),
    getYouTubeChannelsForHomepage(), 
    getHomepageImages(),
    getAwardsData()
  ]);
  
  return (
    <HomeMain 
      channels={youtubeChannels} // Use YouTube channels for project section (max 10)
      creators={creators.slice(0, 20)} // Limit to 20 creators for gallery view 
      brands={brands}
      homepageImages={homepageImages}
      awards={awards}
    />
  );
};

export default Home;
