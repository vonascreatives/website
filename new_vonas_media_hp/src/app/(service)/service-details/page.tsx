import React from "react";
import { Metadata } from "next";
import ServiceDetailsMain from "@/_pages/service/service-details";

export const metadata: Metadata = {
  title: "Liko - Service Details page",
};

const ServiceDetailsPage = () => {
  return (
    <ServiceDetailsMain/>
  );
};

export default ServiceDetailsPage;
