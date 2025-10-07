"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { ScrollSmoother } from "@/plugins";

type ScrollSmootherModule = {
  create?: (options: Record<string, unknown>) => { kill: () => void } | null;
};

const ScrollSmootherPlugin = ScrollSmoother as unknown as ScrollSmootherModule;

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

    if (ScrollSmootherPlugin?.create) {
      smootherInstance = ScrollSmootherPlugin.create({
        smooth: 2,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
    }

    return () => {
      if (smootherInstance?.kill) {
        smootherInstance.kill();
        smootherInstance = null;
      }
    };
  }, []);
}
