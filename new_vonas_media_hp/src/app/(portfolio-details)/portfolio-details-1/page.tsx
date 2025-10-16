import React from "react";
import { Metadata } from "next";
import PortfolioDetailsOneMain from "@/_pages/portfolio/details/portfolio-details-1-main";


export const metadata: Metadata = {
  title: "Liko - Portfolio Details 1 page",
};

// Disable static generation for this page due to GSAP plugins requiring browser APIs
export const dynamic = 'force-dynamic';

const PortfolioDetailsOnePage = () => {
  return (
    <PortfolioDetailsOneMain/>
  );
};

export default PortfolioDetailsOnePage;
