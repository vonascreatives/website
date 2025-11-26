'use client';
import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import HeroBannerOne from "@/components/hero-banner/hero-banner-one";
import VideOne from "@/components/video/video-one";
import BrandOne from "@/components/brand/brand-one";
import ServiceOne from "@/components/service/service-one";
import ProjectOne from "@/components/project/project-one";
import AwardOne from "@/components/award/award-one";
import PortfolioDetailsShowcaseTwoArea from "@/components/portfolio/details/portfolio-details-showcase-2-area";
import PortfolioDetailsShowcaseTwoAreaCms from "@/components/portfolio/details/portfolio-details-showcase-2-area-cms";
import TeamOne from "@/components/team/team-one";
import TestimonialOne from "@/components/testimonial/testimonial-one";
import FooterOne from "@/layouts/footers/footer-one";

// images
import shape_1 from '@/assets/img/home-01/footer/footer-circle-shape-1.png';
import shape_2 from '@/assets/img/home-01/footer/footer-circle-shape-2.png';

// animation
import { videoAnimOne } from "@/utils/video-anim";
import { teamMarqueAnim } from "@/utils/scroll-marque";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { bounceAnimation, charAnimation, fadeAnimation, revelAnimationTwo } from "@/utils/title-animation";
import { panelTwoAnimation } from "@/utils/panel-animation";

interface HomeMainProps {
  channels?: any[];
  creators?: any[];
  brands?: any[];
  homepageImages?: any;
  awards?: any[];
  featuredUseCase?: any;
}

const HomeMain = ({ channels, creators, brands, homepageImages, awards, featuredUseCase }: HomeMainProps) => {
  useScrollSmooth();
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add("tp-magic-cursor");
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove("tp-magic-cursor");
      }
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

  useGSAP(() => {
    const timer = setTimeout(() => {
      videoAnimOne();
      // portfolio image wrap
      gsap.timeline({
        scrollTrigger: {
           trigger: ".tp-project-full-img-wrap",
           start: "top 65",
           end: "bottom 0%",
           pin: ".tp-project-full-img",
           pinSpacing: false,
        }
      });
      // team marquee
      teamMarqueAnim();
      hoverBtn();
      footerTwoAnimation();
      fadeAnimation();
      charAnimation();
      bounceAnimation();
      panelTwoAnimation();
      revelAnimationTwo();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper showBackToTop={false}>

      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            
            {/* hero area start */}
            <HeroBannerOne />
            {/* hero area end */}

            {/* video area */}
            <VideOne />
            {/* video area */}

            {/* brand area */}
            <BrandOne brands={brands} homepageImages={homepageImages} />
            {/* brand area */}

            {/* service area */}
            <ServiceOne homepageImages={homepageImages} />
            {/* service area */}

            {/* project area */}
            <ProjectOne channels={channels} homepageImages={homepageImages} />
            {/* project area */}

            {/* award area */}
            <AwardOne awards={awards} />
            {/* award area */}

            {/* case study area */}
            {/* {featuredUseCase ? (
              <PortfolioDetailsShowcaseTwoAreaCms useCase={featuredUseCase} />
            ) : (
              <PortfolioDetailsShowcaseTwoArea />
            )} */}
            {/* case study area */}

            {/* team area */}
            <TeamOne creators={creators} />
            {/* team area */}

            {/* testimonial area */}
            <TestimonialOne />
            {/* testimonial area */}
          </main>

          {/* footer area */}
          <FooterOne />
          {/* footer area */}
        </div>
      </div>

      {/* footer shape */}
      <div className="tp-footer-shape-wrap z-index-5 smooth">
        <Link href="/contact">
            <div className="tp-footer-shape p-relative">
                <Image className="img-1" src={shape_1} alt="shape"/>
                <Image className="img-2" src={shape_2} alt="shape"/>
                <span>Lets Create</span>
            </div>
          </Link>
        </div>
      {/* footer shape */}
    </Wrapper>
  );
};

export default HomeMain;
