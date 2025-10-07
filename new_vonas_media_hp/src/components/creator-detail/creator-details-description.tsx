import React from "react";
import Image from "next/image";
import { getCreatorFollowerCount, formatFollowers } from "@/utils/formatFollowers";
import { processBioContent } from "@/utils/processBio";

interface CreatorDetailsDescriptionProps {
  creator: any;
}

export default function CreatorDetailsDescription({ creator }: CreatorDetailsDescriptionProps) {
  const followerCount = getCreatorFollowerCount(creator);
  const formattedFollowers = formatFollowers(followerCount);
  
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
            <div className="tp-product-details-description-banner-thumb">
              <Image
                src={heroImage}
                alt={creator.name || 'Creator'}
                width={500}
                height={400}
                style={{ objectFit: 'cover', borderRadius: '8px', width: '100%' }}
              />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="tp-product-details-description-banner-content">
              <h4 className="tp-product-details-description-banner-title">About {creator.name}</h4>
              <p>{bioContent}</p>
              <div className="mt-3">
                <strong>Followers:</strong> {formattedFollowers}<br/>
                <strong>Location:</strong> {creator.location || 'United States'}<br/>
                <strong>Specialization:</strong> {creator.niche || creator.niches?.[0] || 'Content Creation'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h4 className="tp-product-details-description-title">Creator Highlights</h4>
      <div className="tp-product-details-description-content">
        <div className="row">
          <div className="col-xl-6">
            <ul className="tp-product-details-description-list">
              <li>✓ Professional content creator with {formattedFollowers} followers</li>
              <li>✓ Based in {creator.location || 'United States'}</li>
              <li>✓ Available for brand collaborations</li>
              <li>✓ Custom content creation services</li>
            </ul>
          </div>
          <div className="col-xl-6">
            <ul className="tp-product-details-description-list">
              <li>✓ High engagement rates and authentic audience</li>
              <li>✓ Professional video and photo content</li>
              <li>✓ Quick turnaround times</li>
              <li>✓ Brand-safe content guaranteed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}