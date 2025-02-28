/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Configure Strict Mode
  reactStrictMode: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Ignore TypeScript and ESLint errors during build (needed for Vercel deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable experimental features for performance
  experimental: {
    // Faster CSS optimization
    optimizeCss: true
  },
};

module.exports = nextConfig; 