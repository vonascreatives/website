"use client";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
// GSAP imports removed to fix syntax error

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderTwelve from "@/layouts/headers/header-twelve";
import ShopArea from "@/components/shop/shop-area";
import FooterSix from "@/layouts/footers/footer-six";

interface ShopMainProps {
  initialCreators?: any[];
}

const ShopMain = ({ initialCreators }: ShopMainProps) => {
  useScrollSmooth();

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderTwelve />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* breadcrumb */}
            <section className="breadcrumb__area include-bg pt-170 pb-90">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-6">
                    <div className="breadcrumb__content p-relative text-center z-index-1">
                      <h3 className="breadcrumb__title">{initialCreators ? 'Select Creators' : 'Our Shop'}</h3>
                      <div className="breadcrumb__list">
                        <span>
                          <a href="#">Home</a>
                        </span>
                        <span>{initialCreators ? 'Select Creators' : 'Shop'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* breadcrumb */}

            {/* shop area */}
            <ShopArea initialCreators={initialCreators} />
            {/* shop area */}
          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default ShopMain;
