'use client';
import React from "react";
import UnifiedHeader from "./unified-header";

// HeaderTwo now uses the UnifiedHeader component
// This demonstrates the consolidation of header components
export default function HeaderTwo() {
  return <UnifiedHeader variant="header-two" />;
}
