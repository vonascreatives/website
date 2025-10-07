'use client';

import React, { useEffect } from "react";
import Image from "next/image";

const HeroBannerOne = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isCancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const mod = await import("@/utils/title-animation");
        if (!isCancelled && typeof mod.fadeAnimation === "function") {
          mod.fadeAnimation();
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to run fadeAnimation", error);
        }
      }
    }, 100);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="tp-hero-area tp-hero-ptb main-slider">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xxl-12">
            <div className="tp-hero-title-wrap mb-35 p-relative">
              <div className="tp-hero-shape-1">
                <Image
                  src="/assets/img/home-01/hero/hero-bg-shape-1-1.svg"
                  alt="shape"
                  width={790}
                  height={700}
                  style={{ height: "auto" }}
                />
              </div>
              <div className="tp-hero-title-box text-center p-relative">
                <h1 className="tp-hero-title tp_fade_bottom">
                  <span className="p-relative">
                    Content
                    <span
                      className="tp-hero-subtitle d-none d-lg-block "
                      aria-hidden="true"
                    >
                      <span style={{ opacity: 0 }}>Creators &amp; Brands</span>
                    </span>
                    <span className="tp-hero-shape-2 d-none d-md-block">
                      <Image
                        src="/assets/img/home-01/hero/hero-shape-1-1.png"
                        alt="shape"
                        width={40}
                        height={40}
                      />
                    </span>
                  </span>
                  <br />
                  Channel
                  <span className="tp-hero-title-img">
                    <video
                      className="tp-zoom-img"
                      src="https://cdn.sanity.io/files/5cywtc7a/production/39ae0791754d3a0315210ac1fd3cdc88ba47c47c.mp4"
                      width={270}
                      height={160}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      style={{
                        borderRadius: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </span>
                  Lab
                </h1>
              </div>
            </div>
            <div className="tp-hero-content tp_fade_bottom">
              <p>
                <span></span>
                Bold digital channel builders partnering with creators and
                brands to make content with impact. We build formats
                that scale—stories that resonate like culture itself.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerOne;
