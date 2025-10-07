import React from "react";
import Image from "next/image";
import { Minus, Plus } from "../../svg";
import { IProductDT } from "@/types/product-d-t";
import { formatFollowers, getCreatorFollowerCount } from "@/utils/formatFollowers";

// images
const variation_images = [
  "/assets/img/inner-shop/shop-details/shop-details-sm-1.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-2.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-3.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-4.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-5.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-6.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-7.jpg",
  "/assets/img/inner-shop/shop-details/shop-details-sm-8.jpg",
];

// prop type
type IProps = {
  product: any;
};

export default function DetailsRightWrap({ product }: IProps) {
  const [quantity, setQuantity] = React.useState(1);
  
  // Null check for product
  if (!product) {
    return (
      <div className="tp-shop-details-right-wrap">
        <h4 className="tp-shop-details-title">Loading...</h4>
      </div>
    );
  }
  
  // Creator-specific data
  const isCreator = product.name && !product.title;
  const displayName = isCreator ? product.name : (product.title || 'Weekender Soda Shoes');
  const displayCategory = isCreator ? (product.niches?.join(' • ') || 'Creator') : (product.category || 'Mens • Running');
  const displayPrice = isCreator ? `${formatFollowers(getCreatorFollowerCount(product)) || 'Featured'} Creator` : `$${product.price || 248}.00`;
  const displayLocation = isCreator && product.location ? product.location : '';
  const displayBio = isCreator ? (product.bioText || (product.bio && product.bio[0]?.children?.[0]?.text) || product.headline || 'Talented creator with authentic content.') : null;
  
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
          <span>{displayPrice}</span>
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
            <span>{isCreator ? 'Featured Creator' : '148 reviews'}</span>
          </div>
        </div>
      </div>
      <div className="tp-shop-details-msg">
        <h4 className="tp-shop-details-title-sm">{isCreator ? 'About Creator' : 'Running Shoe Guarantee'}</h4>
        <p>
          {isCreator ? displayBio : 'This product is excluded from all promotionaldiscounts and offers. Try this shoe for 30 days performance running shoe return guarantee.'}
        </p>
      </div>
      {isCreator && product.packages && product.packages.length > 0 ? (
        <div className="tp-shop-details-variation mb-40">
          <h4 className="tp-shop-details-title-sm">Available Packages</h4>
          <div className="creator-packages">
            {product.packages.map((pkg: any, i: number) => (
              <div key={i} className="creator-package mb-15" style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px'
              }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>
                      {pkg.name}
                    </h6>
                    <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>
                      {pkg.description}
                    </p>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#2c5aa0' }}>
                    ${pkg.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !isCreator ? (
        <div className="tp-shop-details-variation mb-40">
          <h4 className="tp-shop-details-title-sm">Colors available</h4>
          <div className="tp-shop-details-variation-list d-flex align-items-center flex-wrap">
            {variation_images.map((imgSrc, i) => (
              <button
                key={i}
                className="tp-shop-details-variation-button mr-5 mb-5"
              >
                <Image src={imgSrc} alt="variation-img" width={80} height={45} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {isCreator && product.metrics && product.metrics.length > 0 ? (
        <div className="tp-shop-details-size-wrap mb-40">
          <h4 className="tp-shop-details-title-sm">Social Media Reach</h4>
          <div className="creator-metrics" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {product.metrics.map((metric: any, i: number) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 15px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                minWidth: '100px'
              }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#777' }}>
                  {metric.platform}
                </span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#2c5aa0' }}>
                  {metric.followers?.toLocaleString()}
                </span>
                <span style={{ fontSize: '11px', color: '#777' }}>
                  followers
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : !isCreator ? (
        <div className="tp-shop-details-size-wrap mb-40">
          <h4 className="tp-shop-details-title-sm">Man&apos;s Sizes</h4>
          <div className="tp-shop-details-size-list">
            <button>36</button>
            <button>55</button>
            <button>66</button>
            <button>25</button>
            <button>12</button>
            <button>70</button>
            <button>22</button>
            <button>32</button>
            <button>37</button>
            <button>41</button>
          </div>
        </div>
      ) : null}
      <div className="tp-shop-details-action-box mb-40 d-flex align-items-center">
        <div className="tp-shop-details-quantity">
          <span
            className="tp-cart-minus"
            onClick={() => {
              if (quantity > 1) setQuantity(quantity - 1);
            }}
          >
            <Minus />
          </span>
          <input
            className="tp-cart-input"
            type="text"
            defaultValue={quantity}
          />
          <span
            className="tp-cart-plus"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus />
          </span>
        </div>
        <div className="tp-shop-details-btn-box d-flex align-items-center">
          <a className="tp-btn-cart mr-10" href="#" style={{ background: isCreator ? '#2c5aa0' : undefined }}>
            <span>
              <i className={`fa-sharp fa-solid ${isCreator ? 'fa-envelope' : 'fa-cart-shopping'}`}></i>
            </span>
            {isCreator ? 'Contact Creator' : 'Add To Cart'}
          </a>
          <a className="tp-btn-wishlist" href="#">
            <span>
              <i className="fa-sharp fa-light fa-heart"></i>
            </span>
          </a>
        </div>
      </div>
      <div className="tp-shop-details-query">
        {isCreator ? (
          <>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>Availability:</span>
              <p style={{ 
                color: product.availability === 'open' ? '#28a745' : 
                       product.availability === 'limited' ? '#ffc107' : '#dc3545',
                textTransform: 'capitalize'
              }}>
                {product.availability || 'Available'}
              </p>
            </div>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>Specialties:</span>
              <p>{product.niches?.join(', ') || 'Content Creation'}</p>
            </div>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>Total Reach:</span>
              <p>{formatFollowers(getCreatorFollowerCount(product)) || '0'} followers</p>
            </div>
          </>
        ) : (
          <>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>SKU:</span>
              <p>NTB7SDVX44</p>
            </div>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>Category:</span>
              <p>Running Shoes</p>
            </div>
            <div className="tp-shop-details-query-item d-flex align-items-center">
              <span>Tag:</span>
              <p>Shoes</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
