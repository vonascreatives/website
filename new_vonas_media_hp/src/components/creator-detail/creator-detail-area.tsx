"use client";
import React from "react";
import Image from "next/image";
import { useShortlist } from "@/hooks/use-shortlist";
import { formatFollowers, getCreatorFollowerCount } from "@/utils/formatFollowers";
import { processBioContent } from "@/utils/processBio";
import CreatorAbout from "./creator-about";
import CreatorWork from "./creator-work";
import CreatorReviews from "./creator-reviews";

interface CreatorDetailAreaProps {
  creator: any;
}

export default function CreatorDetailArea({ creator }: CreatorDetailAreaProps) {
  const [activeTab, setActiveTab] = React.useState<'about' | 'work' | 'reviews'>('about');
  const { isInShortlist, toggleShortlist, isLoading } = useShortlist();
  
  const creatorImage = creator.heroImage?.[0]?.image || creator.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&crop=face';
  const followerCount = getCreatorFollowerCount(creator);
  const formattedFollowers = formatFollowers(followerCount);
  
  const handleContactClick = () => {
    if (!isInShortlist(creator._id)) {
      toggleShortlist(creator);
    }
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <section className="tp-shop-details-area pt-80 pb-120">
      <div className="container">
        {/* Hero Section */}
        <div className="row mb-60">
          <div className="col-lg-5">
            <div className="tp-shop-details-thumb-wrapper">
              <div className="tp-shop-details-thumb-main p-relative">
                <div className="tp-shop-details-thumb">
                  <Image
                    src={creatorImage}
                    alt={creator.imageAlt || creator.name}
                    width={600}
                    height={600}
                    style={{ objectFit: 'cover', borderRadius: '12px' }}
                  />
                </div>
                
                {creator.verified && (
                  <div className="tp-shop-details-badge">
                    <span className="tp-badge tp-badge-verified">✓ Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-7">
            <div className="tp-shop-details-wrapper">
              <div className="tp-shop-details-category">
                <span>{creator.category?.title || 'Content Creator'}</span>
              </div>
              
              <h3 className="tp-shop-details-title">{creator.name}</h3>
              
              <div className="tp-shop-details-inventory d-flex align-items-center flex-wrap">
                <div className="tp-shop-details-followers me-4">
                  <span className="tp-shop-details-followers-title">Followers:</span>
                  <span className="tp-shop-details-followers-count">{formattedFollowers}</span>
                </div>
                
                {creator.location && (
                  <div className="tp-shop-details-location me-4">
                    <span className="tp-shop-details-location-title">Location:</span>
                    <span className="tp-shop-details-location-text">{creator.location}</span>
                  </div>
                )}
                
                {creator.mainPlatform && (
                  <div className="tp-shop-details-platform">
                    <span className="tp-shop-details-platform-title">Main Platform:</span>
                    <span className="tp-shop-details-platform-text">{creator.mainPlatform}</span>
                  </div>
                )}
              </div>

              {creator.bio && (
                <div className="tp-shop-details-excerpt">
                  <p>{processBioContent(creator.bio)}</p>
                </div>
              )}

              <div className="tp-shop-details-action-wrapper">
                <div className="tp-shop-details-action-item-wrapper d-flex align-items-center flex-wrap">
                  <div className="tp-shop-details-btn-box">
                    <button 
                      className={`tp-btn-cart ${isInShortlist(creator._id) ? 'added-to-shortlist' : ''}`}
                      onClick={handleContactClick}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Adding...' : isInShortlist(creator._id) ? 'Contact Now' : 'Add to Shortlist & Contact'}
                    </button>
                  </div>
                  
                  <div className="tp-shop-details-btn-box">
                    <button 
                      className={`tp-btn-cart-border ${isInShortlist(creator._id) ? 'active' : ''}`}
                      onClick={() => toggleShortlist(creator)}
                      disabled={isLoading}
                    >
                      <span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1.75C7 1.75 2.625 3.5 2.625 7.875C2.625 12.25 7 12.25 7 12.25C7 12.25 11.375 12.25 11.375 7.875C11.375 3.5 7 1.75 7 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {isInShortlist(creator._id) ? 'In Shortlist' : 'Save to Shortlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-shop-details-tab">
              <nav>
                <div className="nav nav-tabs tp-shop-details-tab-btn" role="tablist">
                  <button
                    className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                    type="button"
                  >
                    About
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'work' ? 'active' : ''}`}
                    onClick={() => setActiveTab('work')}
                    type="button"
                  >
                    Selected Work
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                    type="button"
                  >
                    Reviews
                  </button>
                </div>
              </nav>
              
              <div className="tab-content tp-shop-details-tab-content">
                <div className={`tab-pane fade ${activeTab === 'about' ? 'show active' : ''}`}>
                  <CreatorAbout creator={creator} />
                </div>
                
                <div className={`tab-pane fade ${activeTab === 'work' ? 'show active' : ''}`}>
                  <CreatorWork creator={creator} />
                </div>
                
                <div className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`}>
                  <CreatorReviews creator={creator} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
