import React from "react";
import { Metadata } from "next";
import CheckoutMain from "@/pages/checkout/checkout-main";

export const metadata: Metadata = {
  title: "Creator Project Brief - Vonas Media",
  description: "Submit your project brief and requirements to collaborate with selected creators.",
};

const CheckoutPage = () => {
  return (
    <CheckoutMain/>
  );
};

export default CheckoutPage;
