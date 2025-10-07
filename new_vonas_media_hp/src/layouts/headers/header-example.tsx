'use client';
import React from 'react';
import UnifiedHeader from './unified-header';

// Example usage of the UnifiedHeader component
// This demonstrates how to replace individual header components

// Replace HeaderOne with:
export const HeaderOneUnified = () => (
  <UnifiedHeader variant="header-one" />
);

// Replace HeaderTwo with:
export const HeaderTwoUnified = () => (
  <UnifiedHeader variant="header-two" />
);

// Replace HeaderThree with:
export const HeaderThreeUnified = () => (
  <UnifiedHeader variant="header-three" />
);

// Replace HeaderFour with:
export const HeaderFourUnified = () => (
  <UnifiedHeader variant="header-four" />
);

// Replace HeaderFive with:
export const HeaderFiveUnified = () => (
  <UnifiedHeader variant="header-five" />
);

// Replace HeaderSix with:
export const HeaderSixUnified = () => (
  <UnifiedHeader variant="header-six" />
);

// Replace HeaderEleven with:
export const HeaderElevenUnified = ({ transparent = false, cls = '' }) => (
  <UnifiedHeader 
    variant="header-eleven" 
    transparent={transparent}
    className={cls}
  />
);

// Replace HeaderCreators with:
export const HeaderCreatorsUnified = () => (
  <UnifiedHeader variant="header-creators" />
);

// Custom configuration example:
export const CustomHeaderExample = () => (
  <UnifiedHeader 
    variant="header-one"
    className="custom-header"
    containerClass="container-fluid"
    logoSrc="/custom-logo.png"
    transparent={false}
    sticky={true}
  />
);

export default UnifiedHeader;