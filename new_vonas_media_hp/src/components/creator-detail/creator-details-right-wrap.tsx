import React from "react";
import { useShortlist } from "@/hooks/use-shortlist";
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
  const displayLocation = creator.location || '';
  const displayBio = creator.headline || processBioContent(creator.bio) || 'Professional content creator specializing in engaging digital content.';
  
  // Build social platform buttons from socialLinks object {youtube: url, instagram: url, ...}
  const PLATFORM_META: Record<string, { label: string; svg: React.ReactNode }> = {
    youtube: {
      label: 'YouTube',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
    instagram: {
      label: 'Instagram',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    },
    tiktok: {
      label: 'TikTok',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
    },
    twitter: {
      label: 'Twitter / X',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
    facebook: {
      label: 'Facebook',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    linkedin: {
      label: 'LinkedIn',
      svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
  };

  const socialEntries = creator.socialLinks && !Array.isArray(creator.socialLinks)
    ? Object.entries(creator.socialLinks as Record<string, string>).filter(([, url]) => Boolean(url))
    : [];
  
  const handleContact = async () => {
    await addToShortlist({
      _id: creator._id,
      name: creator.name,
      slug: creator.slug,
      image: creator.image,
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
      {socialEntries.length > 0 && (
        <div className="tp-shop-details-variation mb-40">
          <h4 className="tp-shop-details-title-sm">Active Platforms</h4>
          <div className="tp-shop-details-variation-list d-flex align-items-center flex-wrap" style={{ gap: '8px' }}>
            {socialEntries.map(([platform, url]) => {
              const meta = PLATFORM_META[platform.toLowerCase()];
              if (!meta) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-shop-details-variation-button"
                  style={{
                    width: '80px', height: '74px', border: '1px solid #ddd', borderRadius: '4px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', backgroundColor: '#fff', fontSize: '10px',
                    fontWeight: '500', color: '#333', padding: '5px', textDecoration: 'none', gap: '4px'
                  }}
                  aria-label={meta.label}
                >
                  {meta.svg}
                  {meta.label}
                </a>
              );
            })}
          </div>
        </div>
      )}


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
            color: (creator.availability === 'Available' || creator.availability?.status === 'available') ? '#28a745' : 
                   (creator.availability === 'Busy' || creator.availability?.status === 'busy') ? '#dc3545' : '#ffc107'
          }}>
            {creator.availability || creator.availability?.status || 'Unknown'}
          </p>
        </div>
        <div className="tp-shop-details-query-item d-flex align-items-center">
          <span>Specialties:</span>
          <p>{creator.niches?.join(', ') || 'Content Creation'}</p>
        </div>
      </div>
    </div>
  );
}
