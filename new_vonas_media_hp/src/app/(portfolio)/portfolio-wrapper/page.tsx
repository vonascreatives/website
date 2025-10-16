import React from "react";
import { Metadata } from "next";
import PortfolioWrapperMain from "@/_pages/portfolio/portfolio-wrapper-main";

export const metadata: Metadata = {
  title: "Liko - Portfolio Wrapper page",
};

const PortfolioWrapperPage = () => {
  return (
    <PortfolioWrapperMain/>
  );
};

export default PortfolioWrapperPage;
