import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  // Allow network access for development
  allowedDevOrigins: ['10.139.27.157'],
  // SWC minification is enabled by default in Next.js
  // Optimize images and assets
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  // Enable compression
  compress: true,
  // Optimize routing
  trailingSlash: false,
  // Enable static generation where possible
  generateEtags: true,
  // Performance headers
  poweredByHeader: false,
  // API proxy configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  };

export default nextConfig;
