"use client";
import { gsap } from "gsap";
import React from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger, ScrollSmoother, SplitText } from "@/plugins";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderEleven from "@/layouts/headers/header-eleven";
import FooterTwo from "@/layouts/footers/footer-two";
import AboutUsHero from "@/components/about/about-us-hero";
import AboutUsArea from "@/components/about/about-us-area";
import TeamOne from "@/components/team/team-one";
import FunFactOne from "@/components/fun-fact/fun-fact-one";
import BrandFive from "@/components/brand/brand-five";
import AwardOne from "@/components/award/award-one";
// animation
import { charAnimation, fadeAnimation, titleAnimation } from "@/utils/title-animation";
import { hoverBtn } from "@/utils/hover-btn";
import { teamMarqueAnim } from "@/utils/scroll-marque";

interface AboutUsMainProps {
  aboutData?: any;
  teamMembers?: any[];
  aboutPageImages?: {
    heroImages: any[];
    aboutSectionImages: any[];
    backgroundShapes: any[];
  };
  brandCollaborations?: any[];
}

const AboutUsMain = ({ aboutData, teamMembers, aboutPageImages, brandCollaborations }: AboutUsMainProps) => {
  console.log('🏠 ABOUT US MAIN COMPONENT:');
  console.log('   Team Members prop:', Array.isArray(teamMembers) ? `${teamMembers.length} items` : 'not an array');
  console.log('   First team member:', teamMembers?.[0]?.name || 'No team members');
  console.log('   Team members data structure:', teamMembers?.[0] || 'No data');
  
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      teamMarqueAnim();
      fadeAnimation();
      hoverBtn();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderEleven transparent={true} />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* about hero */}
            <AboutUsHero heroImages={aboutPageImages?.heroImages} />
            {/* about hero */}

            {/* about area */}
            <AboutUsArea aboutSectionImages={aboutPageImages?.aboutSectionImages} />
            {/* about area */}

            {/* team area */}
            <TeamOne spacing="" creators={teamMembers} />
            {/* team area */}

            {/* fun fact area */}
            <FunFactOne />
            {/* fun fact area */}

            {/* brand area */}
            <BrandFive 
              brandCollaborations={brandCollaborations}
              backgroundShape={aboutPageImages?.backgroundShapes?.find(img => 
                img.title?.toLowerCase().includes('bg') || 
                img.title?.toLowerCase().includes('shape')
              ) || aboutPageImages?.backgroundShapes?.[0]}
            />
            {/* brand area */}

            {/* award area */}
            <AwardOne cls="ab-award-style pt-120 pb-120" abStyle={true} />
            {/* award area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default AboutUsMain;
