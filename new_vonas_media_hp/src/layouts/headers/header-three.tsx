'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderMenus from "./header-menus";
import useSticky from "@/hooks/use-sticky";
import logo from '@/assets/img/logo/logo-white.png';
import HeaderActions from "@/components/common/header-actions";

export default function HeaderThree() {
  const {sticky,headerRef,headerFullWidth} = useSticky();
  useEffect(() => {
    headerFullWidth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <header className="tp-header-height">
        <div
          id="header-sticky"
          className={`tp-header-4-area tp-header-4-mob-space tp-transparent z-index-5 ${sticky?'header-sticky':''}`}
        >
          <div className="container container-1770">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-6 col-md-5 col-4">
                <div className="tp-header-logo">
                  <Link href="/">
                    <Image src={logo} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-6 d-none d-xl-block">
                <div className="tp-header-4-menu header-main-menu">
                  <nav className="tp-main-menu-content">
                    {/* header menus */}
                    <HeaderMenus />
                    {/* header menus */}
                  </nav>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-7 col-8">
                <HeaderActions 
                  variant="style4"
                  showCart={true}
                  showMobileMenu={true}
                  showContactButton={true}
                  contactButtonText="Get in touch"
                  contactButtonHref="/contact"
                />
              </div>
            </div>
          </div>
        </div>
      </header>


    </>
  );
}
