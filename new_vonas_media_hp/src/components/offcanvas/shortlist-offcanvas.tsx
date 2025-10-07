import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useShortlist } from "@/hooks/use-shortlist";
import { formatFollowersWithLabel } from "@/utils/formatFollowers";

// prop type
type IProps = {
  openShortlistMini: boolean;
  setOpenShortlistMini: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ShortlistOffcanvas({openShortlistMini, setOpenShortlistMini}: IProps) {
  const { shortlist, removeFromShortlist } = useShortlist();
  
  const handleRemove = async (creatorId: string) => {
    await removeFromShortlist(creatorId);
  };

  return (
    <>
      <div
        className={`cartmini__area ${openShortlistMini ? "cartmini-opened" : ""}`}
      >
        <div className="cartmini__wrapper d-flex justify-content-between flex-column">
          <div className="cartmini__top-wrapper">
            <div className="cartmini__top p-relative">
              <div className="cartmini__top-title">
                <h4>Shortlist</h4>
              </div>
              <div className="cartmini__close">
                <button
                  onClick={() => setOpenShortlistMini(false)}
                  type="button"
                  className="cartmini__close-btn cartmini-close-btn"
                >
                  <i className="fal fa-times"></i>
                </button>
              </div>
            </div>
            <div className="cartmini__shipping">
              <p>Your shortlisted creators for <span>collaboration</span></p>
            </div>
            <div className="cartmini__widget">
              {shortlist && shortlist.creators.length > 0 ? (
                shortlist.creators.map((creator) => (
                  <div key={creator._id} className="cartmini__widget-item">
                    <div className="cartmini__thumb">
                      <Link href={`/creators/${creator.slug.current}`}>
                        {creator.image ? (
                          <Image
                            src={creator.image}
                            alt={creator.name}
                            width={70}
                            height={70}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '70px', 
                              height: '70px', 
                              backgroundColor: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: '#666'
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="cartmini__content">
                      <h5 className="cartmini__title">
                        <Link href={`/creators/${creator.slug.current}`}>{creator.name}</Link>
                      </h5>
                      <div className="cartmini__price-wrapper">
                        <span className="cartmini__price">{formatFollowersWithLabel(creator.followers || 0)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(creator._id)}
                      className="cartmini__del"
                    >
                      <i className="fa-regular fa-xmark"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="cartmini__empty text-center py-30">
                  <p>Your shortlist is empty</p>
                </div>
              )}
            </div>
          </div>
          <div className="cartmini__checkout">
            <div className="cartmini__checkout-title mb-30">
              <h4>Total Creators:</h4>
              <span>{shortlist?.creators.length || 0}</span>
            </div>
            <div className="cartmini__checkout-btn">
              <Link
                href="/shortlist"
                className="tp-btn-black-2 text-center mb-10 w-100"
                onClick={() => setOpenShortlistMini(false)}
              >
                view shortlist
              </Link>
              <Link
                href="/checkout"
                className="tp-btn-black-2 text-center w-100"
                onClick={() => setOpenShortlistMini(false)}
              >
                contact creators
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div
        onClick={() => setOpenShortlistMini(false)}
        className={`body-overlay ${openShortlistMini ? "opened" : ""}`}
      ></div>
    </>
  );
}