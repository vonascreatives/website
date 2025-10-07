"use client";
import { gsap } from "gsap";
import React from "react";
import Image from "next/image";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import { Close, Minus, Plus } from "@/components/svg";
import { useShortlist } from "@/hooks/use-shortlist";
import Link from "next/link";
import { formatFollowersWithLabel } from "@/utils/formatFollowers";

const ShortlistMain = () => {
  const [quantity, setQuantity] = React.useState(1);
  const { 
    shortlist, 
    removeFromShortlist, 
    addToShortlist,
    isLoading 
  } = useShortlist();
  useScrollSmooth();

  const handleRemove = async (creatorId: string) => {
    await removeFromShortlist(creatorId);
  };

  const handleAddToCart = async (creator: any) => {
    await addToShortlist(creator);
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  const handleContactAll = () => {
    // Redirect to checkout with all creators
    window.location.href = '/checkout';
  };

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* wishlist area */}
            <div className="tp-wishlist-area pt-200 pb-120">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    {shortlist && shortlist.creators.length > 0 ? (
                      <>
                        <div className="tp-cart-list mb-45 mr-30">
                          <table className="table">
                            <thead>
                              <tr>
                                <th colSpan={2} className="tp-cart-header-product">
                                  Creator
                                </th>
                                <th className="tp-cart-header-price">Followers</th>
                                <th className="tp-cart-header-quantity">
                                  Campaigns
                                </th>
                                <th>Action</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {shortlist.creators.map((creator) => (
                                <tr key={creator._id}>
                                  <td className="tp-cart-img">
                                    <Link href={`/creators/${creator.slug.current}`}>
                                      {creator.image ? (
                                        <Image
                                          src={creator.image}
                                          alt={creator.imageAlt || creator.name}
                                          width={78}
                                          height={100}
                                          style={{ objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div 
                                          className="bg-light d-flex align-items-center justify-content-center"
                                          style={{ width: '78px', height: '100px', fontSize: '12px', color: '#666' }}
                                        >
                                          No Image
                                        </div>
                                      )}
                                    </Link>
                                  </td>
                                  <td className="tp-cart-title">
                                    <Link href={`/creators/${creator.slug.current}`}>
                                      {creator.name}
                                    </Link>
                                  </td>
                                  <td className="tp-cart-price">
                                    <span>{formatFollowersWithLabel(creator.followers || 0)}</span>
                                  </td>
                                  <td className="tp-cart-quantity">
                                    <div className="tp-product-quantity mt-10 mb-10">
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
                                        value={quantity}
                                        readOnly
                                      />
                                      <span
                                        className="tp-cart-plus"
                                        onClick={() => setQuantity(quantity + 1)}
                                      >
                                        <Plus />
                                      </span>
                                    </div>
                                  </td>

                                  <td className="tp-cart-add-to-cart">
                                    <button 
                                      type="submit" 
                                      className="tp-btn-cart sm"
                                      onClick={() => handleAddToCart(creator)}
                                      disabled={isLoading}
                                    >
                                      Add to Contact
                                    </button>
                                  </td>

                                  <td className="tp-cart-action">
                                    <button 
                                      className="tp-cart-action-btn"
                                      onClick={() => handleRemove(creator._id)}
                                      disabled={isLoading}
                                    >
                                      <Close />
                                      <span>Remove</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="tp-cart-bottom">
                          <div className="row align-items-end">
                            <div className="col-xl-6">
                              <div className="tp-cart-update">
                                <Link href="/creators" className="tp-btn-cart">
                                  Browse More Creators
                                </Link>
                              </div>
                            </div>
                            <div className="col-xl-6">
                              <div className="tp-cart-update text-end">
                                <button 
                                  onClick={handleContactAll}
                                  className="tp-btn-cart"
                                  disabled={isLoading}
                                >
                                  Contact All
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="tp-cart-empty text-center">
                        <h3 className="tp-cart-empty-title">Your shortlist is empty</h3>
                        <p className="mb-30">You haven&apos;t added any creators to your shortlist yet.</p>
                        <Link href="/creators" className="tp-btn-cart">
                          Browse Creators
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* wishlist area */}
          </main>

          {/* footer area */}
          <FooterOne />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default ShortlistMain;