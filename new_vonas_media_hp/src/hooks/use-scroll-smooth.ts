"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let smootherInstance: any = null;

export default function useScrollSmooth() {
  useGSAP(() => {
    if (typeof window === "undefined") return;

    const smoothWrapper = document.getElementById("smooth-wrapper");
    const smoothContent = document.getElementById("smooth-content");

    if (!smoothWrapper || !smoothContent) {
      return;
    }

    gsap.config({
      nullTargetWarn: false,
    });

    if (smootherInstance?.kill) {
      smootherInstance.kill();
      smootherInstance = null;
    }


  import("@/plugins/gsap-scroll-smoother-export")
      .then((module) => {
        let ScrollSmoother = module.ScrollSmoother || module.default;
        if (ScrollSmoother && typeof ScrollSmoother.create !== "function" && typeof ScrollSmoother.ScrollSmoother?.create === "function") {
          ScrollSmoother = ScrollSmoother.ScrollSmoother;
        }
        if (ScrollSmoother && typeof ScrollSmoother.create === "function") {
          smootherInstance = ScrollSmoother.create({
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
          });
        } else {
          console.warn("ScrollSmoother plugin not found or invalid export.", module);
        }
      })
      .catch((err) => {
        console.warn("ScrollSmoother failed to load:", err);
      });

    return () => {
      if (smootherInstance?.kill) {
        smootherInstance.kill();
        smootherInstance = null;
      }
    };
  }, []);
}
