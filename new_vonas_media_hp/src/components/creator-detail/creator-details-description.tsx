import React from "react";
import Image from "next/image";
import { processBioContent } from "@/utils/processBio";

interface CreatorDetailsDescriptionProps {
  creator: any;
}

export default function CreatorDetailsDescription({ creator }: CreatorDetailsDescriptionProps) {
  
  // Get hero image for the About section
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
    return creator.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  };

  const heroImage = getHeroImage();
  
  // Process bio content using utility function
  const bioContent = processBioContent(creator.bio || creator.bioText || creator.headline);

  return (
    <div className="tp-product-details-description-wrapper mt-40">
      {/* Hero Image Section */}
      <div className="tp-product-details-description-banner mb-40">
        <div className="row">
          <div className="col-xl-6">
            <div
              className="tp-product-details-description-banner-thumb"
              style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden' }}
            >
              <Image
                src={heroImage}
                alt={creator.name || 'Creator'}
                fill
                sizes="(min-width: 1200px) 500px, 90vw"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="tp-product-details-description-banner-content">
              <h4 className="tp-product-details-description-banner-title">About {creator.name}</h4>
              <p>{bioContent}</p>
              <div className="mt-3">
                <strong>Location:</strong> {creator.location || 'United States'}<br/>
                <strong>Specialization:</strong> {creator.niche || creator.niches?.[0] || 'Content Creation'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
