import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
    ],
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting with more granular chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          // GSAP libraries - heavy animation library
          gsap: {
            test: /[\/]node_modules[\/](gsap|@gsap)[\/]/,
            name: 'gsap',
            chunks: 'all',
            priority: 30,
          },
          // Three.js - 3D library
          three: {
            test: /[\/]node_modules[\/]three[\/]/,
            name: 'three',
            chunks: 'all',
            priority: 25,
          },
          // Swiper - slider library
          swiper: {
            test: /[\/]node_modules[\/]swiper[\/]/,
            name: 'swiper',
            chunks: 'all',
            priority: 20,
          },
          // Sanity libraries
          sanity: {
            test: /[\/]node_modules[\/](sanity|@sanity|next-sanity)[\/]/,
            name: 'sanity',
            chunks: 'all',
            priority: 15,
          },
          // React and core libraries
          react: {
            test: /[\/]node_modules[\/](react|react-dom)[\/]/,
            name: 'react',
            chunks: 'all',
            priority: 10,
          },
          // Other vendor libraries
          vendor: {
            test: /[\/]node_modules[\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 5,
          },
          // Common application code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 1,
            enforce: true,
          },
        },
      };
    }

    // Add alias for @ to src
    config.resolve.alias['@'] = new URL('./src', import.meta.url).pathname;

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
