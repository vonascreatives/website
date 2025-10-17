import React from "react";
import Image from "next/image";
import { formatFollowers, getCreatorFollowerCount } from "@/utils/formatFollowers";

interface PortfolioItem {
  title: string;
  type: string;
  image?: string | null;
  alt?: string;
}

interface CreatorDetailsWorkProps {
  creator: any;
}

export default function CreatorDetailsWork({ creator }: CreatorDetailsWorkProps) {
  const portfolioItems: PortfolioItem[] = creator?.portfolio && Array.isArray(creator.portfolio) && creator.portfolio.length > 0
    ? creator.portfolio.map((item: any) => ({
        title: item.title || 'Untitled Project',
        type: item.type || 'Content Type',
        image: item.image?.asset?.url || item.image || null,
        alt: item.alt || item.title || 'Portfolio item'
      }))
    : [
        {
          title: "Brand Campaign for Fashion Co.",
          type: "Instagram Posts + Stories",
          image: null,
          alt: "Portfolio placeholder"
        },
        {
          title: "Product Launch Video",
          type: "TikTok Video",
          image: null,
          alt: "Portfolio placeholder"
        },
        {
          title: "Lifestyle Content Series", 
          type: "Multi-Platform",
          image: null,
          alt: "Portfolio placeholder"
        }
      ];

  return (
    <div className="tp-product-details-additional-information">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <div className="tp-product-details-additional-information-tab-content">
            
            {/* Portfolio Grid */}
            <div className="tp-product-details-additional-information-wrapper">
              <h4 className="tp-product-details-additional-information-title">Recent Work & Portfolio</h4>
              
              <div className="row justify-content-center">
                {portfolioItems.map((item: PortfolioItem, i: number) => (
                  <div key={i} className="col-xl-4 col-lg-6 mb-30">
                    <div className="tp-product-details-work-item">
                      {/* Portfolio image from CMS or placeholder */}
                      <div className="tp-product-details-work-thumb mb-20">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.alt || item.title || 'Portfolio item'}
                            width={400}
                            height={200}
                            style={{ 
                              borderRadius: '8px',
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{ 
                              backgroundColor: '#f5f5f5',
                              borderRadius: '8px',
                              width: '100%',
                              height: '200px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              fontSize: '14px'
                            }}>
                            Portfolio Image
                          </div>
                        )}
                      </div>
                      <div className="tp-product-details-work-content">
                        <h6 className="tp-product-details-work-title">{item.title}</h6>
                        <p className="tp-product-details-work-type">{item.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Packages */}
            <div className="tp-product-details-additional-information-wrapper mt-40">
              <h4 className="tp-product-details-additional-information-title">Content Packages & Services</h4>
              
              <div className="tp-product-details-package-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Deliverables</th>
                      <th>Timeline</th>
                      <th>Pricing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Basic Post</strong></td>
                      <td>1 Instagram post + story</td>
                      <td>3-5 days</td>
                      <td>From $500</td>
                    </tr>
                    <tr>
                      <td><strong>Content Series</strong></td>
                      <td>5 posts + 10 stories</td>
                      <td>1-2 weeks</td>
                      <td>From $2,000</td>
                    </tr>
                    <tr>
                      <td><strong>Video Campaign</strong></td>
                      <td>3 video posts + reels</td>
                      <td>2-3 weeks</td>
                      <td>From $3,500</td>
                    </tr>
                    <tr>
                      <td><strong>Brand Partnership</strong></td>
                      <td>Monthly content package</td>
                      <td>Ongoing</td>
                      <td>Custom pricing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Media Stats */}
            <div className="tp-product-details-additional-information-wrapper mt-40">
              <h4 className="tp-product-details-additional-information-title">Social Media Performance</h4>
              
              <div className="row justify-content-center">
                <div className="col-xl-3 col-6">
                  <div className="tp-product-details-stat-item text-center p-20" style={{ border: '1px solid #e5e5e5', borderRadius: '8px' }}>
                    <h5 style={{ color: '#2c5aa0', marginBottom: '5px' }}>
                      {formatFollowers(getCreatorFollowerCount(creator)) || '150K'}
                    </h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>Total Followers</p>
                  </div>
                </div>
                <div className="col-xl-3 col-6">
                  <div className="tp-product-details-stat-item text-center p-20" style={{ border: '1px solid #e5e5e5', borderRadius: '8px' }}>
                    <h5 style={{ color: '#2c5aa0', marginBottom: '5px' }}>95%</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>Brand Safety</p>
                  </div>
                </div>
                <div className="col-xl-3 col-6">
                  <div className="tp-product-details-stat-item text-center p-20" style={{ border: '1px solid #e5e5e5', borderRadius: '8px' }}>
                    <h5 style={{ color: '#2c5aa0', marginBottom: '5px' }}>24h</h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>Response Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
