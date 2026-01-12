"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/img/logo/logo-white.png';
import { footerOneAnimation, footerTwoAnimation } from "@/utils/footer-anim";

const footer_links = [
  { link: "/channels", title: "Channels" },
  { link: "/creators", title: "Creators" },
  { link: "/about", title: "About" },
  { link: "/news", title: "News" },
  { link: "/jobs", title: "Jobs" },
  { link: "/contact", title: "Contact" },
  { link: "/about", title: "Knowledge Base" },
];
export default function FooterOne() {
  const [isActive, setIsActive] = React.useState(false);
  useEffect(() => {
    footerOneAnimation();
  }, [])
  return (
    <footer>
      {/* footer area start */}
      <div className="tp-footer-area black-bg pt-90">
        <div className="container-fluid">
          <div className="tp-footer-wrap">
            <div className="row align-items-end">
              <div className="col-xl-5 col-lg-6">
                <div className="tp-footer-menu menu-anim">
                  <ul className="counter-row tp-text-anim">
                    {footer_links.map((item, i) => (
                      <li
                        key={i}
                        onMouseEnter={() => setIsActive(true)}
                        onMouseLeave={() => setIsActive(false)}
                        className={isActive ? "" : "active"}
                      >
                        <a href={item.link}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6">
                <div className="tp-footer-middle-wrap">
                  <div className="tp-footer-content">
                    <h4 className="tp-footer-big-title footer-big-text">{"Let's"} Build!</h4>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="tp-footer-widget">
                        <h4 className="tp-footer-title tp_fade_bottom">
                          Say hello at:
                        </h4>
                        <div className="tp-footer-widget-info">
                          <div className="tp-footer-widget-info-mail tp_fade_bottom">
                            <a href="mailto:hello@vonas-media.com">
                              hello@vonas-media.com
                            </a>
                          </div>
                          <div className="tp-footer-widget-info-location tp_fade_bottom">
                            <a
                              href="https://www.google.com/maps"
                              target="_blank"
                            >
                              Content Channel Lab <br /> Manila, Philippines
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="tp-footer-widget">
                        <h4 className="tp-footer-title tp_fade_bottom">
                          Follow us
                        </h4>
                        <ul className="tp-footer-widget-social">
                          <li className="tp_fade_bottom">
                            <a href="https://www.instagram.com/vonas.creatives/">Instagram</a>
                          </li>
                          <li className="tp_fade_bottom">
                            <a href="https://www.facebook.com/vonas.creative">Facebook</a>
                          </li>
                          <li className="tp_fade_bottom">
                            <a href="https://www.linkedin.com/in/vonas-ph-1203a817b/">Linkedin</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* footer area end */}

        {/* copyright area start */}
        <div className="container-fluid">
          <div className="tp-copyright-wrap">
            <div className="row align-items-center">
              <div className="col-xl-6 col-md-4">
                <div className="tp-copyright-logo text-center text-md-start">
                  <Link href="/">
                    <Image src={logo} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-6 col-md-8">
                <div className="tp-copyright-text text-center text-md-end">
                  <p>
                    Copyright © {new Date().getFullYear()} Vonas Media. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* copyright area end */}
      </div>
      {/* footer area start */}
    </footer>
  );
}
