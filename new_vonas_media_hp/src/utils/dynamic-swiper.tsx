/**
 * Dynamic Swiper loader to reduce initial bundle size
 * Only loads Swiper when actually needed
 */

import React from 'react';

let swiperInstance: any = null;
let swiperPromise: Promise<any> | null = null;

export const loadSwiper = async () => {
  if (swiperInstance) {
    return swiperInstance;
  }

  if (swiperPromise) {
    return swiperPromise;
  }

  swiperPromise = Promise.all([
    import('swiper/react'),
    import('swiper/modules'),
    // CSS imports are handled in globals.scss
  ]).then(([swiperReact, swiperModules]) => {
    swiperInstance = {
      Swiper: swiperReact.Swiper,
      SwiperSlide: swiperReact.SwiperSlide,
      Navigation: swiperModules.Navigation,
      Pagination: swiperModules.Pagination,
      Autoplay: swiperModules.Autoplay,
      EffectFade: swiperModules.EffectFade,
      FreeMode: swiperModules.FreeMode,
      Mousewheel: swiperModules.Mousewheel,
    };
    return swiperInstance;
  });

  return swiperPromise;
};

// Preload Swiper on user interaction
export const preloadSwiper = () => {
  if (typeof window !== 'undefined' && !swiperInstance && !swiperPromise) {
    const preload = () => {
      loadSwiper();
      document.removeEventListener('mouseover', preload);
      document.removeEventListener('scroll', preload);
      document.removeEventListener('touchstart', preload);
    };

    document.addEventListener('mouseover', preload, { once: true });
    document.addEventListener('scroll', preload, { once: true });
    document.addEventListener('touchstart', preload, { once: true });
  }
};

// Dynamic Swiper component
export const DynamicSwiper: React.FC<any> = ({ children, ...props }) => {
  const [SwiperComponent, setSwiperComponent] = React.useState<any>(null);

  React.useEffect(() => {
    loadSwiper().then((swiper) => {
      setSwiperComponent(() => swiper.Swiper);
    });
  }, []);

  if (!SwiperComponent) {
    return (
      <div className="swiper-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return React.createElement(SwiperComponent, props, children);
};

// Dynamic SwiperSlide component
export const DynamicSwiperSlide: React.FC<any> = ({ children, ...props }) => {
  const [SwiperSlideComponent, setSwiperSlideComponent] = React.useState<any>(null);

  React.useEffect(() => {
    loadSwiper().then((swiper) => {
      setSwiperSlideComponent(() => swiper.SwiperSlide);
    });
  }, []);

  if (!SwiperSlideComponent) {
    return React.createElement('div', { className: 'swiper-slide-loading' }, children);
  }

  return React.createElement(SwiperSlideComponent, props, children);
};
