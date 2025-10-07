"use client";
import React from "react";
import UnifiedHeader from "./unified-header";

// HeaderOne now uses the UnifiedHeader component
// This demonstrates the consolidation of header components
const HeaderOne = () => {
  return <UnifiedHeader variant="header-one" />;
};

export default HeaderOne;
