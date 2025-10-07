"use client";
import { gsap } from "gsap";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderTwelve from "@/layouts/headers/header-twelve";
import FooterTwo from "@/layouts/footers/footer-two";
import CreatorCheckoutArea from "@/components/checkout/creator-checkout-area";

const CheckoutMain = () => {

  useScrollSmooth();

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderTwelve />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* checkout area */}
            <CreatorCheckoutArea/>
            {/* checkout area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default CheckoutMain;
