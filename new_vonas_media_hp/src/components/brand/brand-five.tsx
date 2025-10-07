import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

// Static imports as fallbacks
import b_1 from "@/assets/img/inner-about/brand/brand-1.png";
import b_2 from "@/assets/img/inner-about/brand/brand-2.png";
import b_3 from "@/assets/img/inner-about/brand/brand-3.png";
import b_4 from "@/assets/img/inner-about/brand/brand-4.png";
import b_5 from "@/assets/img/inner-about/brand/brand-5.png";

interface BrandFiveProps {
  // Use Brand Collaboration CMS data instead of static images
  brandCollaborations?: {
    _id: string;
    brandName: string;
    logo: string;
    logoAlt: string;
    slug?: any;
  }[];
  // Background shape from About Us page images
  backgroundShape?: {
    _id: string;
    url: string;
    alt: string;
  };
}

export default function BrandFive({ brandCollaborations, backgroundShape }: BrandFiveProps) {
  // Use Brand Collaboration CMS data with static fallbacks
  const displayBrands = brandCollaborations && brandCollaborations.length > 0 
    ? brandCollaborations.map(brand => ({
        src: brand.logo,
        alt: brand.logoAlt || `${brand.brandName} logo`,
        id: brand._id,
        name: brand.brandName
      }))
    : [
        { src: b_1, alt: 'Client brand logo', id: 'fallback-1', name: 'Client 1' },
        { src: b_2, alt: 'Client brand logo', id: 'fallback-2', name: 'Client 2' },
        { src: b_3, alt: 'Client brand logo', id: 'fallback-3', name: 'Client 3' },
        { src: b_4, alt: 'Client brand logo', id: 'fallback-4', name: 'Client 4' },
        { src: b_5, alt: 'Client brand logo', id: 'fallback-5', name: 'Client 5' },
        { src: b_2, alt: 'Client brand logo', id: 'fallback-6', name: 'Client 6' }
      ];
  
  // Use background shape from About Us page images
  const bgShapeImage = backgroundShape?.url || '/assets/img/inner-about/brand/brand-bg-shape.png';
  return (
    <div
      className="ab-brand-area pt-120 pb-120 black-bg-2"
      style={{
        backgroundImage: `url(${bgShapeImage})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="ab-brand-title-box mb-100">
              <h4 className="ab-brand-title">Our clients</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ab-brand-wrapper mb-80">
              <div className="swiper-container ab-brand-slide-active">
                <Marquee speed={100} loop={0} className="ab-brand-slide-wrap">
                  {displayBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="ab-brand-item"
                    >
                      <Image 
                        src={brand.src} 
                        alt={brand.alt}
                        width={150}
                        height={75}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-7 col-lg-9">
            <div className="ab-brand-content tp_title_anim">
              <p>
                We belive in creating partnerships based on honesty and true
                connection. That is why some of the biggest companies stayed with
                us for years.
              </p>
              <span>More about us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
