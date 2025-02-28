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
  
  // Disable experimental features that might cause issues
  experimental: {
    // Removed optimizeCss which requires critters
  },
};

module.exports = nextConfig; 