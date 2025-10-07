import React from "react";
import { Metadata } from "next";
import ShortlistMain from "@/pages/shortlist/shortlist-main";

export const metadata: Metadata = {
  title: "Shortlist - Vonas Media",
  description: "Your selected content creators - review and contact your favorite creators",
};

const ShortlistPage = () => {
  return <ShortlistMain />;
};

export default ShortlistPage;