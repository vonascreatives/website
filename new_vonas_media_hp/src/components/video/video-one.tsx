'use client';

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "https://cdn.sanity.io/files/5cywtc7a/production/935dd8325b7db952e86500683cdb3658b79dd224.mp4";

const VideOne = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.scrollY > 120 || document.documentElement.scrollTop > 120) {
        setShouldRender(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    if (typeof window === "undefined") return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    gsap.set(videoEl, {
      scale: 0.7,
      autoAlpha: 0,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".tp-hero-bottom-img-wrap",
        start: "top 70%",
        once: true,
        onEnter: () => {
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch(() => {
              /* autoplay may be blocked; ignore */
            });
          }
        },
      },
    });

    tl.to(videoEl, {
      scale: 1,
      autoAlpha: 1,
      duration: 2.8,
      ease: "power3.out",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [shouldRender]);

  return (
    <div className="tp-hero-bottom-img-wrap">
      <div className="tp-hero-bottom-img">
        {shouldRender ? (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster="/assets/img/home-01/hero/hero-video-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              borderRadius: "80px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              borderRadius: "80px",
              paddingTop: "56.25%",
              backgroundImage: "url(/assets/img/home-01/hero/hero-video-poster.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

export default VideOne;