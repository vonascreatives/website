"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UpArrow } from "../svg";
import { useIsotop } from "@/hooks/use-isotop";

// Type definitions
type AffiliateLink = {
  _id: string;
  commissionOffer: string;
  slug: string;
  brandName: string;
  year: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  hoverText: string;
  displayOrder: number;
  featured: boolean;
  isActive: boolean;
};

type AffiliateLinksGridAreaProps = {
  initialAffiliateLinks?: AffiliateLink[];
  style_2?: boolean;
};

export default function AffiliateLinksGridArea({ 
  initialAffiliateLinks = [],
  style_2 = false 
}: AffiliateLinksGridAreaProps) {
  const { initIsotop, isotopContainer } = useIsotop();

  useEffect(() => {
    initIsotop();
  }, [initIsotop]);

  // Helper function to get filter classes for isotope
  const getFilterClasses = (brandName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Agency': 'cat1',
      'Visual': 'cat2',
      'Shooting': 'cat3',
      'Studio': 'cat4',
      'Branding': 'cat2 cat4',
      'Creative': 'cat2 cat4 cat3',
      'Concept': 'cat4 cat2 cat3',
    };
    return categoryMap[brandName] || 'cat4';
  };

  return (
    <div className="tp-project-5-2-area tp-project-5-2-pt pb-130">
      <div className={`container container-${style_2 ? "1800" : "1530"}`}>
        {!style_2 && (
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="portfolio-filter masonary-menu d-flex justify-content-center mb-60" role="group" aria-label="Portfolio filter buttons">
                <button 
                  data-filter="*" 
                  className="active"
                  aria-pressed="true"
                  aria-label="Show all affiliate items"
                >
                  <span>SHOW ALL</span>
                </button>
                <button 
                  data-filter=".cat1"
                  aria-pressed="false"
                  aria-label="Filter by agency items"
                >
                  <span>AGENCY</span>
                </button>
                <button 
                  data-filter=".cat2"
                  aria-pressed="false"
                  aria-label="Filter by visual items"
                >
                  <span>Visual</span>
                </button>
                <button 
                  data-filter=".cat3"
                  aria-pressed="false"
                  aria-label="Filter by shooting items"
                >
                  <span>SHOOTING</span>
                </button>
                <button 
                  data-filter=".cat4"
                  aria-pressed="false"
                  aria-label="Filter by studio items"
                >
                  <span>STUDIO</span>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="row grid" ref={isotopContainer}>
          {initialAffiliateLinks.length > 0 ? (
            initialAffiliateLinks.map((item) => (
              <div
                key={item._id}
                className={`col-xl-4 col-lg-6 col-md-6 grid-item ${getFilterClasses(item.brandName)}`}
              >
                <div 
                  className="tp-project-5-2-thumb mb-30 p-relative not-hide-cursor" 
                  data-cursor={item.hoverText?.replace(' ', '<br>') || 'View<br>Demo'}
                >
                  <Link href={item.affiliateUrl} className="cursor-hide" target="_blank" rel="noopener noreferrer">
                    <Image
                      className="anim-zoomin"
                      src={item.image}
                      alt={item.imageAlt || item.commissionOffer}
                      width={style_2 ? 573 : 486}
                      height={style_2 ? 683 : 576}
                      style={{ height: "100%" }}
                    />
                    <div className="tp-project-5-2-category tp_fade_anim">
                      <span>{item.brandName}</span>
                    </div>
                    <div className="tp-project-5-2-content tp_fade_anim">
                      <span className="tp-project-5-2-meta">{item.year}</span>
                      <h4 className="tp-project-5-2-title-sm">{item.commissionOffer}</h4>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p>No affiliate links available at the moment.</p>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-projct-5-2-btn-box mt-50 d-flex justify-content-center">
              <div className="tp-hover-btn-wrapper">
                <Link
                  className="tp-btn-circle style-2 tp-hover-btn-item tp-hover-btn"
                  href="/portfolio-grid-col-4"
                >
                  <span className="tp-btn-circle-text">
                    More <br /> Projects
                  </span>
                  <span className="tp-btn-circle-icon">
                    <UpArrow />
                  </span>
                  <i className="tp-btn-circle-dot"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
