import React from 'react';
import { Metadata } from 'next';
import HomeSevenMain from '@/_pages/homes/home-7';
import { 
  getYouTubeChannelsForHomepage, 
  getStudioHeroData, 
  getStudioTestimonialsData,
  getStudioCounterData 
} from '@/lib/sanity';

export const metadata: Metadata = {
  title: "Liko - Home Seven Page",
};

const HomePageSeven = async () => {
  const channels = await getYouTubeChannelsForHomepage();
  const studioHeroData = await getStudioHeroData('studio-home');
  const testimonialData = await getStudioTestimonialsData('studio-home');
  const counterData = await getStudioCounterData('studio-home');



  return (
    <HomeSevenMain
      channels={channels}
      studioHeroData={studioHeroData}
      testimonialData={testimonialData}
      counterData={counterData}
    />
  );
};

export default HomePageSeven;
