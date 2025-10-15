"use client";
import { gsap } from "gsap";
import React, { useEffect } from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger, ScrollSmoother, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderSeven from "@/layouts/headers/header-seven";
import StudioPanelOne from "@/components/studio-panels/studio-panel-1";
import StudioPanelOneCms from "@/components/studio-panels/studio-panel-1-cms";
import StudioPanelTwo from "@/components/studio-panels/studio-panel-2";
import StudioPanelThree from "@/components/studio-panels/studio-panel-3";
import StudioPanelFour from "@/components/studio-panels/studio-panel-4";
import StudioPanelFourCms from "@/components/studio-panels/studio-panel-4-cms";
import StudioPanelFive from "@/components/studio-panels/studio-panel-5";
import { studioPanel } from "@/utils/panel-animation";
// animation

interface HomeSevenMainProps {
  channels?: any[];
  studioHeroData?: any;
  testimonialData?: any;
  counterData?: any;
}

const HomeSevenMain = ({ channels, studioHeroData, testimonialData, counterData }: HomeSevenMainProps) => {
  useScrollSmooth();
  
  useEffect(() => {
    document.body.classList.add("tp-smooth-scroll");
    return () => {
      document.body.classList.remove("tp-smooth-scroll");
    };
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      studioPanel();
    }, 100);
    return () => clearTimeout(timer);
  });


  return (
    <Wrapper>
      {/* header area start */}
      <HeaderSeven />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <div className="tp-studio-right-layout">
              {/* hero area start */}

              {/* hero area end */}

              <section className="tp-project-2-area">
                <div className="panels-2 p-relative fix">
                  <div className="panels-container-2 d-flex align-items-center">

                    {/* panel one start */}
                    {studioHeroData?._id && 
                     studioHeroData.thumbnailImages?.length >= 4 ? (
                      <StudioPanelOneCms studioHeroData={studioHeroData} />
                    ) : (
                      <StudioPanelOne />
                    )}
                    {/* panel one end */}

                    {/* panel two start */}
                    <StudioPanelTwo />
                    {/* panel two end */}

                    {/* panel three start */}
                    <StudioPanelThree channels={channels} />
                    {/* panel three end */}

                    {/* panel four start */}
                    {testimonialData?._id && 
                     testimonialData.testimonials?.length > 0 ? (
                      <StudioPanelFourCms 
                        testimonialData={testimonialData}
                        counterData={counterData}
                      />
                    ) : (
                      <StudioPanelFour />
                    )}
                    {/* panel four end */}

                    {/* panel five start */}
                    <StudioPanelFive />
                    {/* panel five end */}

                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* footer area */}

          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default HomeSevenMain;
