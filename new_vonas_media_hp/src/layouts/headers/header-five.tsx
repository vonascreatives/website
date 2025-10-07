import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/img/logo/logo.png';
import logo_2 from '@/assets/img/logo/logo-white.png';
import HeaderActions from "@/components/common/header-actions";

export default function HeaderFive() {
  return (
    <>
    <header>
      <div className="tp-header-2-area tp-header-2-space tp-transparent">
        <div className="container container-1840">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6">
              <div className="tp-header-logo">
                <Link className="logo-1" href="/">
                  <Image src={logo} alt="logo" />
                </Link>
                <Link className="logo-2" href="/">
                  <Image src={logo_2} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-6">
              <HeaderActions 
                  variant="style5-alt"
                  showMobileMenu={true}
                  showContactButton={true}
                  contactButtonText="Get In Touch"
                  contactButtonHref="/contact"
                  animatedContactButton={true}
                  className="tp-header-2-menu-bar text-end text-sm-center"
                />
            </div>
          </div>
        </div>
      </div>
    </header>


    </>
  );
}
