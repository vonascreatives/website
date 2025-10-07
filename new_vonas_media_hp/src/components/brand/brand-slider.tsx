"use client";
import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

// Fallback brand images
import b_1 from "@/assets/img/home-01/brand/brand-1.png";
import b_2 from "@/assets/img/home-01/brand/brand-2.png";

const fallback_brand_images = [b_1, b_2, b_1, b_2, b_1, b_2, b_1, b_2];

type IProps = {
  brands?: any[];
  homepageImages?: any;
};

export default function BrandSlider({ brands, homepageImages }: IProps) {
  // Use CMS brand data if available, otherwise fallback to static images
  const hasBrands = brands && brands.length > 0;
  
  // Create display array - duplicate brands to fill marquee if needed
  const displayBrands = hasBrands 
    ? [...brands, ...brands] // Duplicate for continuous marquee
    : fallback_brand_images;
  
  return (
    <div className="tp-brand-slider-active fix">
      <Marquee
        speed={100}
        loop={0}
        className="brand-wrapper"
      >
        {hasBrands ? (
          displayBrands.map((brand, i) => (
            <div key={`${brand._id}-${i}`} className="tp-brand-item" style={{ height: "auto", width: "200px" }}>
              {brand.logo ? (
                <Image 
                  src={brand.logo} 
                  alt={brand.logoAlt || brand.brandName || 'Brand Logo'} 
                  width={120}
                  height={60}
                  style={{ maxHeight: "60px", width: "auto", objectFit: "contain" }}
                />
              ) : (
                <div style={{ 
                  height: "60px", 
                  width: "120px", 
                  background: "#f0f0f0", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#666"
                }}>
                  {brand.brandName || 'Brand'}
                </div>
              )}
            </div>
          ))
        ) : (
          fallback_brand_images.map((b, i) => (
            <div key={i} className="tp-brand-item" style={{ height: "auto", width: "200px" }}>
              <Image src={b} alt={`Brand ${i + 1}`} />
            </div>
          ))
        )}
      </Marquee>
    </div>
  );
}
