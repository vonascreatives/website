import $ from "jquery";

let gsapModule: any;
let SplitTextPlugin: any;
let Power2Ease: any;
let pluginsRegistered = false;
let gsapPromise: Promise<any> | null = null;

async function ensureGSAP() {
  if (typeof window === "undefined") return null;
  if (gsapModule) return gsapModule;

  if (!gsapPromise) {
    gsapPromise = (async () => {
      const gsapImport = await import("gsap");
      const gsap = gsapImport.gsap || gsapImport.default;
      Power2Ease = (gsapImport as any).Power2 || (gsap as any).Power2;

      if (!pluginsRegistered) {
        const pluginImport = await import("@/plugins");
        const { ScrollTrigger, SplitText } = pluginImport;

        if (ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
        }

        if (SplitText) {
          gsap.registerPlugin(SplitText);
          SplitTextPlugin = SplitText;
        }

        pluginsRegistered = true;
      }

      gsapModule = gsap;
      return gsapModule;
    })();
  }

  gsapModule = await gsapPromise;
  return gsapModule;
}

async function heroTitleAnim() {
  const gsap = await ensureGSAP();
  if (!gsap) return;

  const heroArea = document.querySelector(".tp-hero-2-area");
  if (heroArea) {
    gsap.set(".tp-hero-2-title.text-1", { x: 300 });
    gsap.to(".tp-hero-2-title.text-1", {
      scrollTrigger: {
        trigger: heroArea,
        start: "top center",
        markers: false,
      },
      duration: 1.7,
      x: 0,
    });

    gsap.set(".tp-hero-2-title.text-2", { x: -300 });
    gsap.to(".tp-hero-2-title.text-2", {
      scrollTrigger: {
        trigger: heroArea,
        start: "top center",
        markers: false,
      },
      duration: 1.7,
      x: 0,
    });

    gsap.set(".tp-hero-2-content", { x: -500 });
    gsap.to(".tp-hero-2-content", {
      scrollTrigger: {
        trigger: heroArea,
        start: "top center",
        markers: false,
      },
      duration: 2,
      x: 0,
    });
  }
}

async function heroBgAnimation() {
  const gsap = await ensureGSAP();
  if (!gsap) return;

  const heroBg = document.querySelector(".tp-hero-bg-single");
  if (heroBg) {
    gsap.from(heroBg, {
      scale: 1.3,
      duration: 1.5,
    });
  }
}

// bounce animation
async function bounceAnimation(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap) return;

  const bounce = document.querySelectorAll(".tp-btn-bounce");
  if (bounce.length > 0) {
    gsap.from(bounce, { y: -100, opacity: 0 });
    let mybtn = gsap.utils.toArray(bounce);
    mybtn.forEach((btn: any) => {
      const $this = $(btn);
      gsap.to(btn, {
        scrollTrigger: {
          trigger: $this.closest(".tp-btn-trigger"),
          start: "top center",
          markers: false,
        },
        duration: 1,
        ease: "bounce.out",
        y: 0,
        opacity: 1,
      });
    });

    gsap.from(bounce, { y: -100, opacity: 0 });
    let mybtn2 = gsap.utils.toArray(bounce);
    mybtn2.forEach((btn: any) => {
      const $this = $(btn);
      gsap.to(btn, {
        scrollTrigger: {
          trigger: $this.closest(".tp-btn-trigger"),
          start: "bottom bottom",
          markers: false,
        },
        duration: 0.9,
        delay: 4,
        ease: "bounce.out",
        y: 0,
        opacity: 1,
      });
    });
  }
}

// char animation
async function charAnimation(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap || !SplitTextPlugin) return;

  let char_come = gsap.utils.toArray(".tp-char-animation");
  char_come.forEach((splitTextLine: any) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: splitTextLine,
        start: "top 90%",
        end: "bottom 60%",
        scrub: false,
        markers: false,
        toggleActions: "play none none none",
      },
    });

    const itemSplitted = new SplitTextPlugin(splitTextLine, {
      type: "chars, words",
    });

    gsap.set(splitTextLine, { perspective: 300 });
    itemSplitted.split({ type: "chars, words" });
    tl.from(itemSplitted.chars, {
      duration: 1,
      delay: 0.5,
      x: 100,
      autoAlpha: 0,
      stagger: 0.05,
    });
  });
}

// fade left animation
async function fadeAnimation(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap) return;

  if ($(".tp_fade_bottom").length > 0) {
    gsap.set(".tp_fade_bottom", { y: 100, opacity: 0 });
    const fadeArray = gsap.utils.toArray(".tp_fade_bottom");
    fadeArray.forEach((item: any) => {
      let fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top center+=400",
        },
      });
      fadeTl.to(item, {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 1.5,
      });
    });
  }

  if ($(".tp_fade_top").length > 0) {
    gsap.set(".tp_fade_top", { y: -100, opacity: 0 });
    const fadetopArray = gsap.utils.toArray(".tp_fade_top");
    fadetopArray.forEach((item: any) => {
      let fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top center+=100",
        },
      });
      fadeTl.to(item, {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 2.5,
      });
    });
  }

  if ($(".tp_fade_left").length > 0) {
    gsap.set(".tp_fade_left", { x: -100, opacity: 0 });
    const fadeleftArray = gsap.utils.toArray(".tp_fade_left");
    fadeleftArray.forEach((item: any) => {
      let fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top center+=100",
        },
      });
      fadeTl.to(item, {
        x: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 2.5,
      });
    });
  }

  if ($(".tp_fade_right").length > 0) {
    gsap.set(".tp_fade_right", { x: 100, opacity: 0 });
    const faderightArray = gsap.utils.toArray(".tp_fade_right");
    faderightArray.forEach((item: any) => {
      let fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top center+=100",
        },
      });
      fadeTl.to(item, {
        x: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 2.5,
      });
    });
  }

  if ($(".tp_fade_anim").length > 0) {
    const fadeArrayup = gsap.utils.toArray(".tp_fade_anim");
    fadeArrayup.forEach((t: any) => {
      let r = "bottom",
        a = 1,
        o = 1,
        i = 50,
        s = 0.5,
        l = "power2.out";
      t.getAttribute("data-fade-offset") && (i = t.getAttribute("data-fade-offset"));
      t.getAttribute("data-duration") && (o = t.getAttribute("data-duration"));
      t.getAttribute("data-fade-from") && (r = t.getAttribute("data-fade-from"));
      t.getAttribute("data-on-scroll") && (a = t.getAttribute("data-on-scroll"));
      t.getAttribute("data-delay") && (s = t.getAttribute("data-delay"));
      t.getAttribute("data-ease") && (l = t.getAttribute("data-ease"));
      if (a == 1) {
        if (r == "top")
          gsap.from(t, {
            y: -i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
            scrollTrigger: {
              trigger: t,
              start: "top 110%",
            },
          });
        if (r == "left")
          gsap.from(t, {
            x: -i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
            scrollTrigger: {
              trigger: t,
              start: "top 110%",
            },
          });
        if (r == "bottom")
          gsap.from(t, {
            y: i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
            scrollTrigger: {
              trigger: t,
              start: "top 110%",
            },
          });
        if (r == "right")
          gsap.from(t, {
            x: i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
            scrollTrigger: {
              trigger: t,
              start: "top 110%",
            },
          });
        if (r == "in")
          gsap.from(t, {
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
            scrollTrigger: {
              trigger: t,
              start: "top 110%",
            },
          });
      } else {
        if (r == "top")
          gsap.from(t, {
            y: -i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
          });
        if (r == "left")
          gsap.from(t, {
            x: -i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
          });
        if (r == "bottom")
          gsap.from(t, {
            y: i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
          });
        if (r == "right")
          gsap.from(t, {
            x: i,
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
          });
        if (r == "in")
          gsap.from(t, {
            opacity: 0,
            ease: l,
            duration: o,
            delay: s,
          });
      }
    });
  }
}
async function revelAnimationOne(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap || !SplitTextPlugin) return;

  const anim_reveal: NodeListOf<HTMLElement> =
    document.querySelectorAll(".tp_reveal_anim");
  if (anim_reveal.length > 0) {
    anim_reveal.forEach((areveal: any) => {
      let duration_value: number = Number(areveal.getAttribute("data-duration")) || 1.5;
      let onscroll_value: number = Number(areveal.getAttribute("data-on-scroll")) || 1;
      let stagger_value: number = Number(areveal.getAttribute("data-stagger")) || 0.02;
      let data_delay: number = Number(areveal.getAttribute("data-delay")) || 0.05;

      areveal.split = new SplitTextPlugin(areveal, {
        type: "lines,words,chars",
        linesClass: "tp-reveal-line",
      });

      const animationConfig = {
        duration: duration_value,
        delay: data_delay,
        ease: "circ.out",
        y: 200,
        stagger: stagger_value,
        opacity: 0,
      };

      if (onscroll_value === 1) {
        areveal.anim = gsap.from(areveal.split.chars, {
          ...animationConfig,
          scrollTrigger: {
            trigger: areveal,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        });
      } else {
        areveal.anim = gsap.from(areveal.split.chars, animationConfig);
      }
    });
  }
}
// revel animation two
async function revelAnimationTwo(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap || !SplitTextPlugin) return;

  const anim_reveal2: NodeListOf<HTMLElement> =
    document.querySelectorAll(".tp_reveal_anim-2");
  if (anim_reveal2.length > 0) {
    anim_reveal2.forEach((areveal: any) => {
      let duration_value: number = Number(areveal.getAttribute("data-duration")) || 2;
      let onscroll_value: number = Number(areveal.getAttribute("data-on-scroll")) || 1;
      let stagger_value: number = Number(areveal.getAttribute("data-stagger")) || 0.05;
      let data_delay: number = Number(areveal.getAttribute("data-delay")) || 0.1;

      areveal.split = new SplitTextPlugin(areveal, {
        type: "lines,words,chars",
        linesClass: "tp-reveal-line-2",
      });

      const animationConfig = {
        duration: duration_value,
        delay: data_delay,
        ease: "circ.out",
        y: 200,
        stagger: stagger_value,
        opacity: 0,
      };

      if (onscroll_value === 1) {
        areveal.anim = gsap.from(areveal.split.chars, {
          ...animationConfig,
          scrollTrigger: {
            trigger: areveal,
            start: "top 85%",
          },
        });
      } else {
        areveal.anim = gsap.from(areveal.split.chars, animationConfig);
      }
    });
  }
}

async function zoomAnimation(): Promise<void> {
  const gsap = await ensureGSAP();
  if (!gsap) return;

  if ($(".anim-zoomin").length > 0) {
    $(".anim-zoomin").each(function () {
      $(this).wrap('<div class="anim-zoomin-wrap"></div>');

      $(".anim-zoomin-wrap").css({ overflow: "hidden" });

      const $this = $(this);
      const $asiWrap = $this.parents(".anim-zoomin-wrap");

      let tp_ZoomIn = gsap.timeline({
        scrollTrigger: {
          trigger: $asiWrap,
          start: "top 90%",
          markers: false,
        },
      });
      tp_ZoomIn.from($this, {
        duration: 1.5,
        autoAlpha: 0,
        scale: 1.4,
        ease: Power2Ease?.easeOut || "power2.out",
        clearProps: "all",
      });
    });
  }
};

async function titleAnimation() {
  const gsap = await ensureGSAP();
  if (!gsap || !SplitTextPlugin) return;

  if ($('.tp_title_anim').length > 0) {
    let splitTitleLines = gsap.utils.toArray(".tp_title_anim");
    splitTitleLines.forEach((splitTextLine: any) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 90%',
          end: 'bottom 60%',
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitTextPlugin(splitTextLine, { type: "words, lines" });
      gsap.set(splitTextLine, { perspective: 400 });
      itemSplitted.split({ type: "lines" })
      tl.from(itemSplitted.lines, {
        duration: 1,
        delay: 0.3,
        opacity: 0,
        rotationX: -80,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1
      });
    });
  }
}

export {
  heroTitleAnim,
  heroBgAnimation,
  bounceAnimation,
  fadeAnimation,
  charAnimation,
  revelAnimationTwo,
  revelAnimationOne,
  zoomAnimation,
  titleAnimation,
};
