import React from "react";
import { Metadata } from "next";
import AboutMeMain from "@/_pages/about/about-me";

export const metadata: Metadata = {
  title: "Liko - About us page",
};

const AboutMePage = () => {
  return (
    <AboutMeMain/>
  );
};

export default AboutMePage;
