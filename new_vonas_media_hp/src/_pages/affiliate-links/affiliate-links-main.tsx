"use client";
import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { cursorAnimation } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

import Wrapper from "@/layouts/wrapper";
import HeaderEleven from "@/layouts/headers/header-eleven";
import AffiliateLinksGridArea from "@/components/affiliate-links/affiliate-links-grid-area";
import BigText from "@/components/big-text";
import FooterTwo from "@/layouts/footers/footer-two";
import { hoverBtn } from "@/utils/hover-btn";
import {charAnimation,fadeAnimation,titleAnimation,zoomAnimation} from "@/utils/title-animation";

type AffiliateLink = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  hoverText: string;
  displayOrder: number;
  featured: boolean;
  isActive: boolean;
};

type AffiliateLinksMainProps = {
  initialAffiliateLinks?: AffiliateLink[];
};

const AffiliateLinksMain = ({ initialAffiliateLinks = [] }: AffiliateLinksMainProps) => {
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
      charAnimation();
      titleAnimation();
      hoverBtn();
      zoomAnimation();
      fadeAnimation();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>

      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      {/* header area start */}
      <HeaderEleven />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* affiliate links hero */}
            <div className="tm-hero-area tm-hero-ptb">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tm-hero-content">
                      <span className="tm-hero-subtitle">Vonas Media</span>
                      <h4 className="tm-hero-title fs-220 tp-char-animation">
                        Affiliate Links
                      </h4>
                    </div>
                    <div className="tm-hero-text tp_title_anim">
                      <p>
                        Explore our curated collection of affiliate partnerships
                        and collaborative projects showcasing our work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* affiliate links hero */}

            {/* affiliate links grid area */}
            <AffiliateLinksGridArea initialAffiliateLinks={initialAffiliateLinks} />
            {/* affiliate links grid area */}

            {/* big text */}
            <BigText />
            {/* big text */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default AffiliateLinksMain;
