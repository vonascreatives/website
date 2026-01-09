import React from "react";
import { Metadata } from "next";
import HomeSevenMain from "@/_pages/homes/home-7";
import {
  getChannelsData,
  getStudioHeroData,
  getStudioTestimonialsData,
  getStudioCounterData
} from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Our Channels",
};

// Enable ISR (Incremental Static Regeneration) with 10-second revalidation
export const revalidate = 10;

const ChannelsPage = async () => {
  try {
    const youtubeChannels = await getChannelsData();
    const studioHeroData = await getStudioHeroData('studio-home');
    const testimonialData = await getStudioTestimonialsData('studio-home');
    const counterData = await getStudioCounterData('studio-home');

    return (
      <HomeSevenMain
        channels={youtubeChannels}
        studioHeroData={studioHeroData}
        testimonialData={testimonialData}
        counterData={counterData}
      />
    );
  } catch (error) {
    return (
      <HomeSevenMain
        channels={[]}
      />
    );
  }
};

export default ChannelsPage;
