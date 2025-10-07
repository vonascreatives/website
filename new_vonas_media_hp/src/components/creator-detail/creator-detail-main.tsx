"use client";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
// GSAP imports removed to fix syntax error

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import CreatorDetailsArea from "@/components/creator-detail/creator-details-area";
import CreatorDetailsBottomArea from "@/components/creator-detail/creator-details-bottom-area";

interface CreatorDetailMainProps {
  creator: any;
}

const CreatorDetailMain = ({ creator }: CreatorDetailMainProps) => {
  useScrollSmooth();

  // GSAP animations removed to fix syntax error
  React.useEffect(() => {
    // Animation disabled
  }, []);

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* creator details */}
            <CreatorDetailsArea creator={creator} />
            {/* creator details */}

            {/* creator details bottom area */}
            <CreatorDetailsBottomArea creator={creator} />
            {/* creator details bottom area */}
          </main>

          {/* footer area */}
          <FooterOne />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default CreatorDetailMain;
