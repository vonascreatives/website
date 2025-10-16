import React from "react";
import { Metadata } from "next";
import CreatorsMain from "@/_pages/creators/creators-main";
import { getCreatorsData } from "@/lib/sanity";
import { getCreatorFilterData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Premium Content Creators",
  description: "Connect with our exclusive network of premium content creators and influencers. Find the perfect match for your brand campaigns and collaborations.",
};

const CreatorsPage = async () => {
  const [creators, filterOptions] = await Promise.all([
    getCreatorsData(),
    getCreatorFilterData()
  ]);
  
  return (
    <CreatorsMain 
      initialCreators={creators} 
      filterOptions={filterOptions}
    />
  );
};

export default CreatorsPage;
