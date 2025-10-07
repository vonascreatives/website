"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getSanityImageUrl } from '@/lib/sanity'
import CreatorDetailsRightWrap from "./creator-details-right-wrap";

interface CreatorDetailsAreaProps {
  creator: any;
}

export default function CreatorDetailsArea({ creator }: CreatorDetailsAreaProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Early return if no creator data
  if (!creator) {
    return (
      <div className="creator-details-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p>Creator not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get only gallery images (excluding hero image)
  const getGalleryImages = () => {
    const images: string[] = [];
    
    // Add only gallery images (not hero image)
    if (creator.gallery && Array.isArray(creator.gallery)) {
      creator.gallery.forEach((item: any) => {
        // Handle both URL strings (fallback) and objects (CMS)
        if (typeof item === 'string') {
          images.push(item);
        } else if (item && item.image) {
          images.push(item.image);
        }
      });
    }
    
    // Use the main creator image as fallback if no gallery images available
    if (images.length === 0 && creator.image) {
      images.push(creator.image);
    }
    
    return images;
  };

  // Get hero image separately
  const getHeroImage = () => {
    if (creator.heroImage && Array.isArray(creator.heroImage) && creator.heroImage.length > 0) {
      const heroImg = creator.heroImage[0];
      // Handle both URL strings (fallback) and resolved URLs (CMS)
      if (typeof heroImg === 'string') {
        return heroImg;
      } else if (heroImg && heroImg.image) {
        return heroImg.image;
      }
    }
    return null;
  };

  const galleryImages = getGalleryImages();

  return (
    <div className="tp-shop-details-2-area tp-product-details-2-style pt-170">
      <div className="container container-1300">
        <div className="row align-items-start">
          <div className="col-xl-6 col-lg-6">
            <div className="tp-product-details-thumb-wrapper tp-tab">
              {/* Main Hero Image */}
              <div className="tab-content m-img mb-20" id="creatorDetailsNavContent">
                {galleryImages.map((imgSrc: string, i: number) => (
                  <div
                    key={i}
                    className={`tab-pane fade ${i === activeImageIndex ? "show active" : ""}`}
                    id={`nav-${i + 1}`}
                    role="tabpanel"
                    aria-labelledby={`nav-${i + 1}-tab`}
                    tabIndex={0}
                  >
                    <div className="tp-product-details-nav-main-thumb">
                      <Image
                        className="w-100"
                        src={imgSrc}
                        alt={`${creator.name || 'Creator'} - Image ${i + 1}`}
                        width={600}
                        height={600}
                        style={{ height: "auto", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Gallery Thumbnails */}
              <nav>
                <div className="nav nav-tabs" id="creatorDetailsNavThumb" role="tablist">
                   {galleryImages.map((imgSrc: string, i: number) => (
                     <button
                       key={i}
                       className={`nav-link ${i === activeImageIndex ? "active" : ""}`}
                       id={`nav-${i + 1}-tab`}
                       onClick={() => setActiveImageIndex(i)}
                       type="button"
                       role="tab"
                       aria-controls={`nav-${i + 1}`}
                       aria-selected={i === activeImageIndex}
                     >
                       <Image
                         className="w-100"
                         src={imgSrc}
                         alt={`${creator.name || 'Creator'} thumbnail ${i + 1}`}
                         width={100}
                         height={100}
                         style={{ height: "100%", objectFit: "cover" }}
                       />
                     </button>
                   ))}
                </div>
              </nav>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <CreatorDetailsRightWrap creator={creator} />
          </div>
        </div>
      </div>
    </div>
  );
}