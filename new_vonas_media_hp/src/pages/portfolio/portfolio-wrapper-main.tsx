"use client";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
// GSAP imports removed to fix syntax error

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderEleven from "@/layouts/headers/header-eleven";
import ProjectFour from "@/components/project/project-four";
import BigText from "@/components/big-text";
import FooterTwo from "@/layouts/footers/footer-two";
// animation
import { charAnimation,titleAnimation } from "@/utils/title-animation";
import { projectThreeAnimation } from "@/utils/project-anim";

const PortfolioWrapperMain = () => {
  useScrollSmooth();

  // GSAP animation disabled to fix syntax error
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Animation functions disabled
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderEleven />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* portfolio hero */}
            <div className="tm-hero-area tm-hero-ptb">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tm-hero-content">
                      <span className="tm-hero-subtitle">Liko Studio</span>
                      <h4 className="tm-hero-title tp-char-animation">
                        Our latest & great projects
                      </h4>
                    </div>
                    <div className="tm-hero-text">
                      <p className="tp_title_anim">
                        We’re a diverse team that works as fancies attention to
                        details, enjoys beers on Friday nights and aspires to
                        design the dent in the universe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* portfolio hero */}

            {/* portfolio area */}
            <ProjectFour style_2={true}/>
            {/* portfolio area */}

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

export default PortfolioWrapperMain;
