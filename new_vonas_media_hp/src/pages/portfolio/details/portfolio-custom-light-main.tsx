"use client";
import { gsap } from "gsap";
import React from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderSeven from "@/layouts/headers/header-seven";
import PortfolioDetailsCustomLightArea from "@/components/portfolio/details/portfolio-details-custom-light-area";
// animation
import { charAnimation, fadeAnimation, titleAnimation } from "@/utils/title-animation";

interface PortfolioDetailsCustomLightMainProps {
  channel?: any;
  navigation?: {
    prevChannel: { name: string; slug: string; channel_number: string } | null;
    nextChannel: { name: string; slug: string; channel_number: string } | null;
  };
}

const PortfolioDetailsCustomLightMain = ({ channel, navigation }: PortfolioDetailsCustomLightMainProps) => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      titleAnimation();
      charAnimation();
      fadeAnimation();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderSeven />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* portfolio details area */}
            <PortfolioDetailsCustomLightArea channel={channel} navigation={navigation} />
            {/* portfolio details area */}
          </main>

          {/* footer area */}

          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default PortfolioDetailsCustomLightMain;
