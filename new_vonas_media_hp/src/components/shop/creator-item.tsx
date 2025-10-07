import React from "react";
import Link from "next/link";
import Image from "next/image";
import { QuickViewEye, WishlistTwo, CartTwo } from "../svg";
import { formatFollowersWithLabel, getCreatorFollowerCount, formatFollowers } from "@/utils/formatFollowers";
import { useShortlist } from "@/hooks/use-shortlist";

// prop type
type IProps = {
  creator: any;
  handleCreatorModal?(creator: any): void;
};

export default function CreatorItem({ creator, handleCreatorModal }: IProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { toggleShortlist, addToShortlist, isInShortlist: checkIsInShortlist } = useShortlist();
  
  // CMS data only - no fallbacks, validate creator has required data
  if (!creator || !creator._id || !creator.name) {
    console.warn('Invalid creator data:', creator);
    return null;
  }
  
  const creatorSlug = creator.slug?.current || creator.slug;
  if (!creatorSlug) {
    console.warn('Creator missing slug:', creator.name, creator._id);
    return null;
  }
  
  const followerCountNum = getCreatorFollowerCount(creator);
  const followerCountFormatted = creator.followers || creator.subscribers || formatFollowersWithLabel(followerCountNum);
  const mainNiche = creator.mainCategory || creator.niche || (creator.niches && creator.niches.length > 0 ? creator.niches[0] : null);
  
  const isInShortlist = checkIsInShortlist(creator._id);
  
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await toggleShortlist({
      _id: creator._id,
      name: creator.name,
      slug: creator.slug,
      image: creator.image,
      imageAlt: creator.imageAlt,
      followers: followerCountNum
    });
  };
  
  const handleContactClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart/shortlist - user can continue browsing or go to checkout later
    await addToShortlist({
      _id: creator._id,
      name: creator.name,
      slug: creator.slug,
      image: creator.image,
      imageAlt: creator.imageAlt,
      followers: followerCountNum
    });
    
    // No automatic redirect - let user continue browsing
  };
  
  return (
    <div 
      className="tp-shop-right-item mb-30 p-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tp-shop-right-thumb fix">
        <Link href={`/creators/${creatorSlug}`} className="d-block">
          {creator.image ? (
            <Image
              className="w-100"
              src={creator.image}
              alt={creator.imageAlt || creator.name}
              width={300}
              height={300}
              style={{ height: "300px", objectFit: "cover" }}
            />
          ) : (
            <div 
              className="w-100 d-flex align-items-center justify-content-center"
              style={{ 
                height: "300px", 
                backgroundColor: "#f5f5f5",
                color: "#666",
                fontSize: "14px"
              }}
            >
              No Image Available
            </div>
          )}
        </Link>
        
        {/* Hover overlay with name and followers */}
        {isHovered && (
          <div 
            className="position-absolute w-100 h-100 d-flex align-items-end"
            style={{
              top: 0,
              left: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 50%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-end w-100 p-3">
              <div>
                <h5 className="text-white mb-0" style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px'
                }}>
                  {creator.name}
                </h5>
              </div>
              <div>
                <span className="text-white" style={{ 
                  fontSize: '14px', 
                  fontWeight: '500'
                }}>
                  {followerCountFormatted}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons - Heart and Contact */}
      <div className="tp-product-action tp-product-action-blackStyle">
        <div className="tp-product-action-item d-flex flex-column">
          <button
            type="button"
            className={`tp-product-action-btn tp-product-add-to-wishlist-btn ${isInShortlist ? 'active' : ''}`}
            onClick={handleHeartClick}
            aria-label="Save to shortlist"
          >
            <WishlistTwo />
            <span className="tp-product-tooltip tp-product-tooltip-right">
              {isInShortlist ? 'Remove from Shortlist' : 'Save to Shortlist'}
            </span>
          </button>
          
          <button
            type="button"
            className="tp-product-action-btn tp-product-add-cart-btn"
            onClick={handleContactClick}
            aria-label="Contact creator"
          >
            <CartTwo />
            <span className="tp-product-tooltip tp-product-tooltip-right">
              Contact
            </span>
          </button>
        </div>
      </div>
      
      {/* No bottom content section needed per requirements */}
    </div>
  );
}
