import React from "react";
import { Metadata } from "next";
import HomeSevenMain from "@/pages/homes/home-7";
import { getChannelsData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Our Channels",
};

const ChannelsPage = async () => {
  // Use all channels data (no limit)
  const youtubeChannels = await getChannelsData();
  
  return (
    <HomeSevenMain channels={youtubeChannels} />
  );
};

export default ChannelsPage;
