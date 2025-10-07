import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useShortlist } from "@/hooks/use-shortlist";

// prop type
type IProps = {
  openCartMini: boolean;
  setOpenCartMini: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CartOffcanvas({openCartMini,setOpenCartMini}:IProps) {
  const { shortlist, removeFromShortlist, getShortlistCount } = useShortlist();
  const cartCount = getShortlistCount();
  
  return (
    <>
      <div
        className={`cartmini__area ${openCartMini ? "cartmini-opened" : ""}`}
      >
        <div className="cartmini__wrapper d-flex justify-content-between flex-column">
          <div className="cartmini__top-wrapper">
            <div className="cartmini__top p-relative">
              <div className="cartmini__top-title">
                <h4>Creator Shortlist ({cartCount})</h4>
              </div>
              <div className="cartmini__close">
                <button
                  onClick={() => setOpenCartMini(false)}
                  type="button"
                  className="cartmini__close-btn cartmini-close-btn"
                >
                  <i className="fal fa-times"></i>
                </button>
              </div>
            </div>
            <div className="cartmini__shipping">
              <p>Selected creators for collaboration</p>
            </div>
            <div className="cartmini__widget">
              {shortlist?.creators && shortlist.creators.length > 0 ? (
                shortlist.creators.map((creator: any) => (
                  <div key={creator._id} className="cartmini__widget-item">
                    <div className="cartmini__thumb">
                      <Link href={`/creators/${creator.slug?.current || creator.slug || creator._id}`}>
                        <Image
                          src={creator.image || '/assets/img/placeholder.jpg'}
                          alt={creator.imageAlt || creator.name}
                          width={70}
                          height={70}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="cartmini__content">
                      <h5 className="cartmini__title">
                        <Link href={`/creators/${creator.slug?.current || creator.slug || creator._id}`}>
                          {creator.name}
                        </Link>
                      </h5>
                      <div className="cartmini__price-wrapper">
                        <span className="cartmini__price">{creator.followers || 'N/A'}</span>
                        <span className="cartmini__quantity">followers</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromShortlist(creator._id)} 
                      className="cartmini__del"
                      aria-label="Remove from shortlist"
                    >
                      <i className="fa-regular fa-xmark"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="cartmini__empty">
                  <p>No creators selected yet</p>
                </div>
              )}
            </div>
          </div>
          <div className="cartmini__checkout">
            <div className="cartmini__checkout-title mb-30">
              <h4>Selected:</h4>
              <span>{cartCount} creator{cartCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="cartmini__checkout-btn">
              <Link
                href="/creators"
                className="tp-btn-black-2 text-center mb-10 w-100"
              >
                Browse More
              </Link>
              <Link
                href="/checkout"
                className="tp-btn-black-2 text-center w-100"
              >
                Start Project
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div
        onClick={() => setOpenCartMini(false)}
        className={`body-overlay ${openCartMini ? "opened" : ""}`}
      ></div>
    </>
  );
}
