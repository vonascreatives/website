'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderMenus from "./header-menus";
import useSticky from "@/hooks/use-sticky";
import HeaderActions from "@/components/common/header-actions";
import { MobileOffcanvas } from "@/components/offcanvas/unified-mobile-offcanvas";

// Logo imports
import logo from '@/assets/img/logo/logo.png';
import logoWhite from '@/assets/img/logo/logo-white.png';

type HeaderVariant = 
  | 'header-one' 
  | 'header-two' 
  | 'header-three' 
  | 'header-four' 
  | 'header-five'
  | 'header-six'
  | 'header-seven'
  | 'header-eight'
  | 'header-nine'
  | 'header-ten'
  | 'header-eleven'
  | 'header-twelve'
  | 'header-creators';

type UnifiedHeaderProps = {
  variant: HeaderVariant;
  className?: string;
  containerClass?: string;
  logoSrc?: string;
  logoWhiteSrc?: string;
  showMenu?: boolean;
  showActions?: boolean;
  transparent?: boolean;
  sticky?: boolean;
};

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  variant,
  className = '',
  containerClass = '',
  logoSrc = '/assets/img/logo/logo.png',
  logoWhiteSrc = '/assets/img/logo/logo-white.png',
  showMenu = true,
  showActions = true,
  transparent = true,
  sticky: enableSticky = true
}) => {
  const { sticky, headerRef, headerFullWidth, adjustMenuBackground } = useSticky();
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);

  useEffect(() => {
    if (['header-one', 'header-three', 'header-four'].includes(variant)) {
      headerFullWidth();
    }
    if (variant === 'header-four') {
      adjustMenuBackground();
    }
  }, [variant, headerFullWidth, adjustMenuBackground]);

  // Get header configuration based on variant
  const getHeaderConfig = () => {
    const configs: Partial<Record<HeaderVariant, any>> = {
      'header-one': {
        headerClass: 'tp-header-height',
        areaClass: 'tp-header-area tp-header-mob-space tp-transparent pl-60 pr-60 z-index-9',
        containerClass: 'container',
        logoColClass: 'col-xl-2 col-lg-2 col-6',
        menuColClass: 'col-xl-8 col-lg-9 d-none d-xl-block',
        actionsColClass: 'col-xl-2 col-lg col-6',
        menuClass: 'tp-header-menu header-main-menu text-center',
        actionsProps: {
          variant: 'style1' as const,
          shortlistVariant: 'link' as const,
          shortlistIconType: 'svg' as const,
          hideCartAndWishlist: true
        }
      },
      'header-two': {
        headerClass: '',
        areaClass: 'tp-header-2-area tp-header-2-ptb z-index-2 tp-transparent',
        containerClass: 'container container-1870',
        logoColClass: 'col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6',
        menuColClass: '',
        actionsColClass: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-6',
        menuClass: '',
        showMenu: false,
        actionsProps: {
          variant: 'style3' as const,
          showCart: true,
          showMobileMenu: true,
          onMobileMenuClick: () => setOpenOffcanvas(true),
          mobileMenuClassName: 'tp-offcanvas-open-btn',
          cartClassName: 'cartmini-open-btn',
          cartText: 'Cart'
        }
      },
      'header-three': {
        headerClass: 'tp-header-height',
        areaClass: 'tp-header-4-area tp-header-4-mob-space tp-transparent z-index-5',
        containerClass: 'container container-1770',
        logoColClass: 'col-xl-2 col-lg-6 col-md-5 col-4',
        menuColClass: 'col-xl-6 d-none d-xl-block',
        actionsColClass: 'col-xl-4 col-lg-6 col-md-7 col-8',
        menuClass: 'tp-header-4-menu header-main-menu',
        logoOnly: 'white',
        actionsProps: {
          variant: 'style4' as const,
          showCart: true,
          showMobileMenu: true,
          showContactButton: true,
          contactButtonText: 'Get in touch',
          contactButtonHref: '/contact'
        }
      },
      'header-four': {
        headerClass: '',
        areaClass: 'tp-header-3-area mt-35 z-index-5',
        containerClass: 'container container-1740',
        logoColClass: 'col-xl-3 col-lg-6 col-md-6 col-6',
        menuColClass: 'col-xl-6 col-lg-6 d-none d-xl-block',
        actionsColClass: 'col-xl-3 col-lg-6 col-md-6 col-6',
        menuClass: 'tp-header-3-menu-wrap text-center',
        specialMenuLayout: true,
        actionsProps: {
          variant: 'style5' as const,
          showMobileMenu: true,
          showSocialIcons: true,
          socialIcons: [
            { platform: 'twitter', icon: 'fa-brands fa-twitter', href: '#' },
            { platform: 'facebook', icon: 'fa-brands fa-facebook', href: '#' },
            { platform: 'instagram', icon: 'fa-brands fa-instagram', href: '#' }
          ]
        }
      },
      'header-five': {
        headerClass: '',
        areaClass: 'tp-header-2-area tp-header-2-space tp-transparent',
        containerClass: 'container container-1840',
        logoColClass: 'col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6',
        menuColClass: '',
        actionsColClass: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-6',
        menuClass: '',
        showMenu: false,
        actionsProps: {
          variant: 'style5-alt' as const,
          showMobileMenu: true,
          showContactButton: true,
          contactButtonText: 'Get In Touch',
          contactButtonHref: '/contact',
          animatedContactButton: true,
          className: 'tp-header-2-menu-bar text-end text-sm-center'
        }
      },
      'header-six': {
        headerClass: 'tp-header-height z-index-5',
        areaClass: 'tp-inner-header-2-area tp-shop-mob-space tp-transparent tp-inner-header-white',
        containerClass: 'container container-1800',
        logoColClass: 'col-xl-2 col-lg-4 col-md-4 col-4',
        menuColClass: 'col-xl-5 d-none d-xl-block',
        actionsColClass: 'col-xl-5 col-lg-8 col-md-8 col-8',
        menuClass: 'tp-inner-header-2-menu header-main-menu',
        logoOnly: 'white',
        actionsProps: {
          variant: 'style2' as const,
          showSearch: true,
          showCart: true,
          showShortlist: true,
          showMobileMenu: true
        }
      },
      'header-eleven': {
        headerClass: 'tp-header-height z-index-5',
        areaClass: 'tp-inner-header-area tp-inner-header-style-2 tp-inner-header-mob-space',
        containerClass: 'container container-1800',
        logoColClass: 'col-xl-2 col-lg-6 col-md-6 col-6',
        menuColClass: 'col-xl-8 col-lg-8 d-none d-xl-block',
        actionsColClass: 'col-xl-2 col-lg-6 col-md-6 col-6',
        menuClass: 'tp-inner-header-right-wrap text-center',
        actionsProps: {
          variant: 'style11' as const,
          showCart: true,
          showMobileMenu: true,
          hideCartAndWishlist: true,
          className: 'tp-inner-header-right-action text-end'
        }
      },
      'header-creators': {
        headerClass: 'tp-header-height z-index-5',
        areaClass: 'tp-inner-header-2-area tp-shop-mob-space tp-transparent tp-inner-header-2-bg',
        containerClass: 'container container-1800',
        logoColClass: 'col-xl-2 col-lg-4 col-md-4 col-4',
        menuColClass: 'col-xl-5 d-none d-xl-block',
        actionsColClass: 'col-xl-5 col-lg-8 col-md-8 col-8',
        menuClass: 'tp-inner-header-2-menu header-main-menu',
        actionsProps: {
          variant: 'style2' as const,
          showSearch: true,
          showShortlist: true,
          showMobileMenu: true
        }
      }
    };

    // Default config for variants not explicitly defined
    const defaultConfig = {
      headerClass: 'tp-header-height',
      areaClass: 'tp-header-area tp-header-mob-space tp-transparent z-index-9',
      containerClass: 'container',
      logoColClass: 'col-xl-2 col-lg-2 col-6',
      menuColClass: 'col-xl-8 col-lg-9 d-none d-xl-block',
      actionsColClass: 'col-xl-2 col-lg col-6',
      menuClass: 'tp-header-menu header-main-menu text-center',
      actionsProps: {
        variant: 'style1' as const
      }
    };

    return configs[variant] || defaultConfig;
  };

  const config = getHeaderConfig();
  const stickyClass = enableSticky && sticky ? 'header-sticky' : '';
  const transparentClass = transparent ? 'tp-transparent' : '';

  const renderLogo = () => {
    if (config.logoOnly === 'white') {
      return (
        <div className="tp-header-logo">
          <Link href="/">
            <Image src={logoWhite} alt="logo" width={85} height={26} />
          </Link>
        </div>
      );
    }

    return (
      <div className="tp-header-logo">
        <Link className="logo-1" href="/">
          <Image src={logoSrc} alt="logo" width={85} height={26} />
        </Link>
        <Link className="logo-2" href="/">
          <Image src={logoWhiteSrc} alt="logo" width={85} height={26} />
        </Link>
      </div>
    );
  };

  const renderMenu = () => {
    if (!showMenu || config.showMenu === false) return null;

    if (config.specialMenuLayout) {
      return (
        <div className={config.menuClass}>
          <div className="tp-header-3-menu-box d-inline-flex align-items-center justify-content-between">
            <div className="tp-header-3-menu header-main-menu">
              <nav className="tp-main-menu-content">
                <HeaderMenus />
              </nav>
            </div>
            <HeaderActions 
              variant="style5"
              renderInlineCart={true}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={config.menuClass}>
        <nav className="tp-main-menu-content">
          <HeaderMenus />
        </nav>
      </div>
    );
  };

  return (
    <>
      <header className={`${config.headerClass} ${className}`} ref={headerRef}>
        {variant === 'header-four' && <span className="menu-bg"></span>}
        <div
          id="header-sticky"
          className={`${config.areaClass} ${transparentClass} ${stickyClass}`}
        >
          <div className={`${config.containerClass} ${containerClass}`}>
            <div className="row align-items-center">
              <div className={config.logoColClass}>
                {renderLogo()}
              </div>
              {config.menuColClass && (
                <div className={config.menuColClass}>
                  {renderMenu()}
                </div>
              )}
              {showActions && (
                <div className={config.actionsColClass}>
                  <HeaderActions {...config.actionsProps} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas for header-two and header-five */}
      {(variant === 'header-two' || variant === 'header-five') && (
        <MobileOffcanvas 
          openOffcanvas={openOffCanvas} 
          setOpenOffcanvas={setOpenOffcanvas} 
        />
      )}
    </>
  );
};

export default UnifiedHeader;
