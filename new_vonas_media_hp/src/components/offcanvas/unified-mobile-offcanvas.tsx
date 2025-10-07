import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Behance, CloseTwo, CloseThree, Dribble, InstagramTwo, Youtube } from "../svg";

// images
import logo from "@/assets/img/logo/logo.png";
import logo_white from "@/assets/img/logo/logo-white.png";
import gallery_1 from "@/assets/img/menu/offcanvas/offcanvas-1.jpg";
import gallery_2 from "@/assets/img/menu/offcanvas/offcanvas-2.jpg";
import gallery_3 from "@/assets/img/menu/offcanvas/offcanvas-3.jpg";
import gallery_4 from "@/assets/img/menu/offcanvas/offcanvas-4.jpg";
import MobileMenus from "./mobile-menus";
import MobileMenusTwo from "./mobile-menus-2";

const gallery_images = [gallery_1, gallery_2, gallery_3, gallery_4];

// Configuration type for different variants
type OffcanvasVariant = 'default' | 'split';

// prop type
type IProps = {
  openOffcanvas: boolean;
  setOpenOffcanvas: React.Dispatch<React.SetStateAction<boolean>>;
  variant?: OffcanvasVariant;
  showGallery?: boolean;
  showSocialIcons?: boolean;
  title?: string;
  description?: string;
};

export default function UnifiedMobileOffcanvas({
  openOffcanvas,
  setOpenOffcanvas,
  variant = 'default',
  showGallery = true,
  showSocialIcons = true,
  title = "Hello There!",
  description = "Welcome to Vonas Media - Your Content Channel Lab for digital success."
}: IProps) {

  // Render default variant (original mobile-offcanvas)
  if (variant === 'default') {
    return (
      <>
        <div className={`tp-offcanvas-area ${openOffcanvas ? "opened" : ""}`}>
          <div className="tp-offcanvas-wrapper">
            <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
              <div className="tp-offcanvas-logo">
                <Link href="/">
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
              <div className="tp-offcanvas-close">
                <button
                  className="tp-offcanvas-close-btn"
                  onClick={() => setOpenOffcanvas(false)}
                >
                  <CloseTwo />
                </button>
              </div>
            </div>
            <div className="tp-offcanvas-main">
              <div className="tp-offcanvas-content">
                <h3 className="tp-offcanvas-title">{title}</h3>
                <p>{description}</p>
              </div>
              <div className="tp-main-menu-mobile d-xl-none">
                <MobileMenus/>
              </div>
              {showGallery && (
                <div className="tp-offcanvas-gallery">
                  <div className="row gx-2">
                    {gallery_images.map((item, i) => (
                      <div className="col-md-3 col-3" key={i}>
                        <div className="tp-offcanvas-gallery-img fix">
                          <a href="#">
                            <Image src={item} alt="gallery-img" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="tp-offcanvas-contact">
                <h3 className="tp-offcanvas-title sm">Information</h3>
                <ul>
                  <li>
                    <a href="mailto:hey@vonas-media.com">hey@vonas-media.com</a>
                  </li>
                  <li>
                    <a href="https://www.google.com/maps" target="_blank">Platinum 2000, 7 Annapolis, San Juan, Manila, Philippines</a>
                  </li>
                </ul>
              </div>
              {showSocialIcons && (
                <div className="tp-offcanvas-social">
                  <h3 className="tp-offcanvas-title sm">Follow Us</h3>
                  <ul>
                    <li>
                      <a href="#"><InstagramTwo /></a>
                    </li>
                    <li>
                      <a href="#"><Dribble /></a>
                    </li>
                    <li>
                      <a href="#"> <Behance /></a>
                    </li>
                    <li>
                      <a href="#"><Youtube /></a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          onClick={() => setOpenOffcanvas(false)}
          className={`body-overlay ${openOffcanvas ? "opened" : ""}`}
        ></div>
      </>
    );
  }

  // Render split variant (original mobile-offcanvas-2)
  return (
    <div className={`tp-offcanvas-2-area p-relative ${openOffcanvas ? "opened" : ""}`}>
      <div className="tp-offcanvas-2-bg is-left left-box"></div>
      <div className="tp-offcanvas-2-bg is-right right-box d-none d-md-block"></div>
      <div className="tp-offcanvas-2-wrapper">
        <div className="tp-offcanvas-2-left left-box">
          <div className="tp-offcanvas-2-left-wrap d-flex justify-content-between align-items-center">
            <div className="tpoffcanvas__logo">
              <Link className="logo-1" href="/">
                <Image src={logo} alt="logo" />
              </Link>
              <Link className="logo-2" href="/">
                <Image src={logo_white} alt="logo" />
              </Link>
            </div>
            <div className="tp-offcanvas-2-close d-md-none text-end">
              <button onClick={() => setOpenOffcanvas(false)} className="tp-offcanvas-2-close-btn tp-offcanvas-2-close-btn">
                <span className="text">
                  <span>close</span>
                </span>
                <span className="d-inline-block">
                  <span>
                    <CloseThree />
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className="tp-main-menu-mobile menu-hover-active counter-row">
            <MobileMenusTwo/>
          </div>
        </div>
        <div className="tp-offcanvas-2-right right-box d-none d-md-block p-relative">
          <div className="tp-offcanvas-2-close text-end">
            <button onClick={() => setOpenOffcanvas(false)} className="tp-offcanvas-2-close-btn">
              <span className="text">
                <span>close</span>
              </span>
              <span className="d-inline-block">
                <span>
                  <CloseTwo />
                </span>
              </span>
            </button>
          </div>
          <div className="tp-offcanvas-2-right-inner d-flex flex-column justify-content-between h-100">
            <div className="tpoffcanvas__right-info">
              <div className="tpoffcanvas__address">
                <p>Platinum 2000, 7 Annapolis, San Juan, Manila, Philippines</p>
              </div>
              <div className="tpoffcanvas__mail">
                <a href="mailto:hey@vonas-media.com">
                  hey@vonas-media.com
                </a>
              </div>
              <div className="tpoffcanvas__text">
                <p>If in doubt. reach out.</p>
              </div>
            </div>
            {showSocialIcons && (
              <div className="tpoffcanvas__social-link">
                <ul>
                  <li><a href="#">Dribbble</a></li>
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">Linkedin</a></li>
                  <li><a href="#">Behance</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export both variants for backward compatibility
export const MobileOffcanvas = (props: Omit<IProps, 'variant'>) => (
  <UnifiedMobileOffcanvas {...props} variant="default" />
);

export const MobileOffcanvasTwo = (props: Omit<IProps, 'variant'>) => (
  <UnifiedMobileOffcanvas {...props} variant="split" />
);