'use client';
import React from 'react';
import Link from 'next/link';
import { Cart, Menu, Search, Zero } from "@/components/svg";
import ShortlistButton from './shortlist-button';
import { MobileOffcanvas } from '@/components/offcanvas/unified-mobile-offcanvas';
import CartOffcanvas from '@/components/offcanvas/cart-offcanvas';
import ShortlistOffcanvas from '@/components/offcanvas/shortlist-offcanvas';

type HeaderActionsProps = {
  variant?: 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style5-alt' | 'style11'; // Different header styles
  showSearch?: boolean;
  showCart?: boolean;
  showShortlist?: boolean;
  showMobileMenu?: boolean;
  shortlistVariant?: 'button' | 'link';
  shortlistIconType?: 'svg' | 'wishlist-component';
  className?: string;
  onMobileMenuClick?: () => void;
  mobileMenuClassName?: string;
  cartClassName?: string;
  cartText?: string;
  showContactButton?: boolean;
  contactButtonText?: string;
  contactButtonHref?: string;
  animatedContactButton?: boolean; // For special animated contact buttons
  showSocialIcons?: boolean;
  socialIcons?: Array<{platform: string; icon: string; href: string;}>;
  renderInlineCart?: boolean; // For style5 where cart is inline with menu
  hideCartAndWishlist?: boolean; // New prop to hide cart and wishlist for aesthetic pages
};

const HeaderActions: React.FC<HeaderActionsProps> = ({
  variant = 'style1',
  showSearch = false,
  showCart = false,
  showShortlist = true,
  showMobileMenu = true,
  shortlistVariant = 'button',
  shortlistIconType = 'wishlist-component',
  className = '',
  onMobileMenuClick,
  mobileMenuClassName = '',
  cartClassName = '',
  cartText = '',
  showContactButton = false,
  contactButtonText = 'Get in touch',
  contactButtonHref = '/contact',
  showSocialIcons = false,
  socialIcons = [],
  renderInlineCart = false,
  animatedContactButton = false,
  hideCartAndWishlist = false
}) => {
  const [openOffCanvas, setOpenOffCanvas] = React.useState(false);
  const [openShortlistMini, setOpenShortlistMini] = React.useState(false);
  const [openCartMini, setOpenCartMini] = React.useState(false);

  const getShortlistClassName = () => {
    if (variant === 'style2') {
      return 'tp-inner-header-2-wishlist';
    }
    return 'tp-header-shortlist';
  };

  const getContainerClassName = () => {
    if (variant === 'style2') {
      return `tp-inner-header-2-right d-flex align-items-center justify-content-end ${className}`;
    }
    if (variant === 'style3') {
       return `d-flex align-items-center justify-content-end ${className}`;
     }
     if (variant === 'style4') {
        return `tp-header-4-right d-flex align-items-center justify-content-end ${className}`;
      }
      if (variant === 'style5') {
        return `tp-header-3-right d-flex align-items-center justify-content-end ${className}`;
      }
    return `tp-header-bar text-end ${className}`;
  };

  return (
    <>
      <div className={getContainerClassName()}>
        {/* Search */}
        {showSearch && (
          <>
            <div className="tp-inner-header-2-search p-relative d-none d-lg-block">
              <input type="text" placeholder="Search" />
              <span>
                <Search />
              </span>
            </div>
            <button className="tp-shop-mob-search d-lg-none">
              <span>
                <Search />
              </span>
            </button>
          </>
        )}

        {/* Shortlist */}
        {showShortlist && !hideCartAndWishlist && (
          <ShortlistButton
            variant={shortlistVariant}
            className={getShortlistClassName()}
            onClick={shortlistVariant === 'button' ? () => setOpenShortlistMini(true) : undefined}
            iconType={shortlistIconType}
          />
        )}

        {/* Mobile Menu Button */}
        {variant !== 'style3' && variant !== 'style11' && (
          <button 
            className={variant === 'style2' ? 'tp-inner-header-2-bar tp-offcanvas-open-btn' : 'tp-offcanvas-open-btn'} 
            onClick={() => setOpenOffCanvas(true)}
          >
            {variant === 'style2' ? (
              <span>
                <Menu />
              </span>
            ) : (
              <>
                <span></span>
                <span></span>
              </>
            )}
          </button>
        )}

        {/* Style3 Mobile Menu Button */}
        {variant === 'style3' && (
          <div className="tp-header-2-menu-bar text-end text-sm-center">
            <button className={mobileMenuClassName} onClick={onMobileMenuClick}>
              <span></span>
              <span></span>
            </button>
          </div>
        )}

        {/* Cart */}
        {showCart && variant !== 'style3' && !hideCartAndWishlist && (
          <button onClick={() => setOpenCartMini(true)} className="tp-inner-header-2-cart cartmini-open-btn">
            <span>
              <Zero />
            </span>
          </button>
        )}

        {/* Style3 Cart */}
          {showCart && variant === 'style3' && !hideCartAndWishlist && (
            <div className="tp-header-2-cart text-end d-none d-sm-block">
              <button className={cartClassName} onClick={() => setOpenCartMini(true)}>
                {cartText}
                <span>
                  <Cart />
                </span>
              </button>
            </div>
          )}

         {/* Style4 Cart */}
         {showCart && variant === 'style4' && !hideCartAndWishlist && (
           <div className="tp-header-3-cart d-none d-sm-block p-relative">
             <button className="cartmini-open-btn" onClick={() => setOpenCartMini(true)}>
               <span>
                 <Cart clr="white" />
               </span>
               <em>0</em>
             </button>
           </div>
         )}

         {/* Style4 Contact Button and Mobile Menu */}
          {variant === 'style4' && (
            <div className="tp-header-4-btn d-flex align-items-center ml-30">
              {showContactButton && (
                <div className={animatedContactButton ? "tp-header-2-btn-box text-end" : ""}>
                  {animatedContactButton ? (
                    <div className="tp-header-2-button">
                      <Link className="tp-btn-animation" href={contactButtonHref}>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                        <span>{contactButtonText}</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      className="tp-btn-border-sm d-none d-sm-block"
                      href={contactButtonHref}
                    >
                      {contactButtonText}
                    </Link>
                  )}
                </div>
              )}
              {showMobileMenu && (
                  <button onClick={() => setOpenOffCanvas(true)} className="ml-20 d-xl-none tp-header-4-bar tp-offcanvas-open-btn">
                    <i className="fa-solid fa-bars"></i>
                  </button>
                )}
            </div>
          )}

          {/* Style5 Alternative Layout (HeaderFive) */}
           {variant === 'style5-alt' && (
             <>
               <div className="tp-header-2-menu-bar text-end text-sm-center">
                 {showMobileMenu && (
                   <button onClick={() => setOpenOffCanvas(true)} className="tp-offcanvas-open-btn">
                     <span></span>
                     <span></span>
                   </button>
                 )}
               </div>
               <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6 d-none d-sm-block">
                 {showContactButton && (
                   <div className="tp-header-2-btn-box text-end">
                     <div className="tp-header-2-button">
                       <Link className="tp-btn-animation" href={contactButtonHref}>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                         <span>{contactButtonText}</span>
                       </Link>
                     </div>
                   </div>
                 )}
               </div>
               {/* Mobile Offcanvas */}
               <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffCanvas} />
             </>
           )}

           {/* Style5 Social Icons and Mobile Menu */}
              {variant === 'style5' && (
               <>
                 <div className="tp-header-3-right d-flex align-items-center justify-content-end">
                   {showSocialIcons && (
                     <div className="tp-header-3-social d-none d-sm-block">
                       {socialIcons.map((social, index) => (
                         <a key={index} href={social.href}>
                           <i className={social.icon}></i>
                         </a>
                       ))}
                     </div>
                   )}
                   {showMobileMenu && (
                     <button onClick={() => setOpenOffCanvas(true)} className="tp-header-3-bar tp-offcanvas-open-btn d-xl-none">
                       <i className="fa-solid fa-bars"></i>
                     </button>
                   )}
                 </div>
                 {/* Mobile Offcanvas */}
                 <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffCanvas} />
               </>
             )}

           {/* Style11 Cart and Mobile Menu (HeaderEleven) */}
           {variant === 'style11' && (
             <>
               <ul>
                 {showCart && !hideCartAndWishlist && (
                   <li>
                     <div className="tp-inner-cart">
                       <a
                         onClick={() => setOpenCartMini(true)}
                         className="cartmini-open-btn pointer"
                       >
                         <span className="p-relative">
                           <Cart />
                           <i>0</i>
                         </span>
                       </a>
                     </div>
                   </li>
                 )}
                 {showMobileMenu && (
                   <li>
                     <div className="tp-inner-bar tp-header-bar">
                       <button onClick={() => setOpenOffCanvas(true)} className="tp-offcanvas-open-btn">
                         <span></span>
                         <span></span>
                       </button>
                     </div>
                   </li>
                 )}
               </ul>

             </>
           )}

           {/* Style5 Inline Cart - rendered separately for menu integration */}
           {renderInlineCart && variant === 'style5' && !hideCartAndWishlist && (
             <>
               <div className="tp-header-3-cart p-relative">
                 <button className="cartmini-open-btn" onClick={() => setOpenCartMini(true)}>
                   <span>
                     <Cart clr="white" />
                   </span>
                   <em>0</em>
                 </button>
               </div>

             </>
           )}
      </div>

      {/* Offcanvas Components */}
      <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffCanvas} />
      
      {showShortlist && shortlistVariant === 'button' && !hideCartAndWishlist && (
        <ShortlistOffcanvas openShortlistMini={openShortlistMini} setOpenShortlistMini={setOpenShortlistMini} />
      )}
      
      {showCart && !hideCartAndWishlist && (
        <CartOffcanvas openCartMini={openCartMini} setOpenCartMini={setOpenCartMini} />
      )}
    </>
  );
};

export default HeaderActions;