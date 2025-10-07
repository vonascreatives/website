import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for lazy-loaded components
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

// Lazy load heavy components with loading states
export const LazyBlogDetailsMain = dynamic(
  () => import('@/pages/blog/blog-details'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyAboutUsMain = dynamic(
  () => import('@/pages/about/about-us'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyContactMain = dynamic(
  () => import('@/pages/contact/contact'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyFaqMain = dynamic(
  () => import('@/pages/faq/faq-main'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyPricingMain = dynamic(
  () => import('@/pages/pricing/pricing-main'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyBlogClassicMain = dynamic(
  () => import('@/pages/blog/blog-classic'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyCreatorsMain = dynamic(
  () => import('@/pages/creators/creators-main'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

export const LazyShopMain = dynamic(
  () => import('@/pages/shop/shop-main'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

// Utility function for creating lazy components with custom loading
export function createLazyComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    loading?: () => JSX.Element;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || (() => <LoadingSpinner />),
    ssr: options?.ssr ?? true,
  });
}

// Lazy load heavy third-party components
export const LazyReactSlick = dynamic(
  () => import('react-slick'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Sliders often have SSR issues
  }
);

export const LazySwiper = dynamic(
  () => import('swiper/react').then(mod => ({ default: mod.Swiper })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazySwiperSlide = dynamic(
  () => import('swiper/react').then(mod => ({ default: mod.SwiperSlide })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);