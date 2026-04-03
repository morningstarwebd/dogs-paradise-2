import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 430, 768, 1024, 1280, 1920],
    imageSizes: [64, 128, 256, 384, 800],
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eysndjacdnenldnihalh.supabase.co',
      },
    ],
  },
};

export default nextConfig;
