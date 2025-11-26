import React, { Suspense } from "react";
import { Metadata } from "next";
import CreatorsMain from "@/_pages/creators/creators-main";
import { getCreatorsData } from "@/lib/sanity";
import { getCreatorFilterData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Premium Content Creators",
  description: "Connect with our exclusive network of premium content creators and influencers. Find the perfect match for your brand campaigns and collaborations.",
};

// Loading component for the Suspense fallback
function CreatorsLoading() {
  return (
    <div className="tp-shop-sidebar-area pb-80">
      <div className="container container-1720">
        <div className="row justify-content-center">
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading creators...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CreatorsPage = async () => {
  const [creators, filterOptions] = await Promise.all([
    getCreatorsData(),
    getCreatorFilterData()
  ]);
  
  return (
    <Suspense fallback={<CreatorsLoading />}>
      <CreatorsMain 
        initialCreators={creators} 
        filterOptions={filterOptions}
      />
    </Suspense>
  );
};

export default CreatorsPage;
