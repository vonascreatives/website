import React from "react";
import Image from "next/image";
import { useShortlist } from "@/hooks/use-shortlist";
import { formatFollowers, getCreatorFollowerCount } from "@/utils/formatFollowers";
import { processBioContent } from "@/utils/processBio";

interface CreatorDetailsRightWrapProps {
  creator: any;
}

export default function CreatorDetailsRightWrap({ creator }: CreatorDetailsRightWrapProps) {
  const { isInShortlist, toggleShortlist, addToShortlist } = useShortlist();
  
  // Null check for creator
  if (!creator) {
    return (
      <div className="tp-shop-details-right-wrap">
        <h4 className="tp-shop-details-title">Loading...</h4>
      </div>
    );
  }
  
  // Creator data
  const displayName = creator.name || 'Content Creator';
  const displayCategory = creator.niches?.join(' • ') || creator.mainCategory || 'Content Creator';
  const followerCount = getCreatorFollowerCount(creator);
  const formattedFollowers = formatFollowers(followerCount);
  const displayLocation = creator.location || '';
  const displayBio = creator.headline || processBioContent(creator.bio) || 'Professional content creator specializing in engaging digital content.';
  
  // Social media platforms (like color variations in shop)
  const socialPlatforms = [
    { name: 'Instagram', icon: '/assets/img/social/instagram-icon.png' },
    { name: 'TikTok', icon: '/assets/img/social/tiktok-icon.png' },
    { name: 'YouTube', icon: '/assets/img/social/youtube-icon.png' },
    { name: 'Twitter', icon: '/assets/img/social/twitter-icon.png' },
    { name: 'LinkedIn', icon: '/assets/img/social/linkedin-icon.png' },
    { name: 'Facebook', icon: '/assets/img/social/facebook-icon.png' }
  ];
  
  // Content packages (like sizes in shop)
  const contentPackages = [
    'Single Post', 'Story Series', 'Video Content', 'Brand Campaign', 'Long-term Partnership'
  ];

  const handleContact = async () => {
    await addToShortlist({
      _id: creator._id,
      name: creator.name,
      slug: creator.slug,
      image: creator.image,
      followers: followerCount
    });
    
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  return (
    <div className="tp-shop-details-right-wrap">
      <div className="tp-shop-details-categories">
        <span>{displayCategory}</span>
      </div>
      <h4 className="tp-shop-details-title">{displayName}</h4>
      {displayLocation && (
        <div className="tp-shop-details-location mb-15">
          <span style={{ color: '#777', fontSize: '14px' }}>📍 {displayLocation}</span>
        </div>
      )}
      <div className="tp-shop-details-inventory d-flex align-items-center">
        <div className="tp-shop-details-price">
          <span>{formattedFollowers} Followers</span>
        </div>
        <div className="tp-shop-details-ratting-wrap d-flex align-items-center">
          <div className="tp-shop-details-ratting">
            <span>
              <i className="fa-sharp fa-solid fa-star"></i>
            </span>
            <span>
              <i className="fa-sharp fa-solid fa-star"></i>
            </span>
            <span>
              <i className="fa-sharp fa-solid fa-star"></i>
            </span>
            <span>
              <i className="fa-sharp fa-solid fa-star"></i>
            </span>
            <span>
              <i className="fa-sharp fa-solid fa-star"></i>
            </span>
          </div>
          <div className="tp-shop-details-reviews">
            <span>Featured Creator</span>
          </div>
        </div>
      </div>
      <div className="tp-shop-details-msg">
        <h4 className="tp-shop-details-title-sm">Creator Guarantee</h4>
        <p>
          {displayBio} Professional content creation with authentic engagement and brand-safe content guaranteed.
        </p>
      </div>
      
      {/* Social Platforms */}
      <div className="tp-shop-details-variation mb-40">
        <h4 className="tp-shop-details-title-sm">Active Platforms</h4>
        <div className="tp-shop-details-variation-list d-flex align-items-center flex-wrap">
          {creator.socialLinks && Array.isArray(creator.socialLinks) ? creator.socialLinks.map((link: any, i: number) => (
            <button
              key={i}
              className="tp-shop-details-variation-button mr-5 mb-5"
              style={{
                width: '80px',
                height: '74px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                fontSize: '10px',
                fontWeight: '500',
                color: '#333',
                padding: '5px'
              }}
            >
              <i className={`fab fa-${link.platform}`} style={{ fontSize: '16px', marginBottom: '4px' }}></i>
              {link.platform?.charAt(0).toUpperCase() + link.platform?.slice(1)}
            </button>
          )) : (
            <>
              <button className="tp-shop-details-variation-button mr-5 mb-5" style={{ width: '80px', height: '74px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontSize: '10px', fontWeight: '500', color: '#333', padding: '5px' }}>
                <i className="fab fa-instagram" style={{ fontSize: '16px', marginBottom: '4px' }}></i>Instagram
              </button>
              <button className="tp-shop-details-variation-button mr-5 mb-5" style={{ width: '80px', height: '74px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontSize: '10px', fontWeight: '500', color: '#333', padding: '5px' }}>
                <i className="fab fa-youtube" style={{ fontSize: '16px', marginBottom: '4px' }}></i>YouTube
              </button>
              <button className="tp-shop-details-variation-button mr-5 mb-5" style={{ width: '80px', height: '74px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontSize: '10px', fontWeight: '500', color: '#333', padding: '5px' }}>
                <i className="fab fa-twitter" style={{ fontSize: '16px', marginBottom: '4px' }}></i>Twitter
              </button>
            </>
          )}
        </div>
      </div>


      {/* Contact Actions */}
      <div className="tp-shop-details-action-box mb-40 d-flex align-items-center">
        <div className="tp-shop-details-btn-box d-flex align-items-center">
          <a className="tp-btn-cart mr-10" href="#" onClick={handleContact}>
            <span>
              <i className="fa-sharp fa-solid fa-envelope"></i>
            </span>
            Contact Creator
          </a>
          <a className="tp-btn-wishlist" href="#" onClick={() => toggleShortlist(creator)}>
            <span>
              <i className={`fa-sharp ${isInShortlist(creator._id) ? 'fa-solid' : 'fa-light'} fa-heart`} style={{ color: isInShortlist(creator._id) ? '#e74c3c' : '#999' }}></i>
            </span>
          </a>
        </div>
      </div>

      {/* Creator Details (like SKU, Category) */}
      <div className="tp-shop-details-query">
        <div className="tp-shop-details-query-item d-flex align-items-center">
          <span>Availability:</span>
          <p style={{ 
            color: creator.availability?.status === 'available' ? '#28a745' : '#ffc107'
          }}>
            {creator.availability?.status || 'Available for Hire'}
          </p>
        </div>
        <div className="tp-shop-details-query-item d-flex align-items-center">
          <span>Specialties:</span>
          <p>{creator.niches?.join(', ') || 'Content Creation'}</p>
        </div>
        <div className="tp-shop-details-query-item d-flex align-items-center">
          <span>Total Reach:</span>
          <p>{formattedFollowers} followers</p>
        </div>
      </div>
    </div>
  );
}
