/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Configure Strict Mode
  reactStrictMode: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable experimental features for performance
  experimental: {
    // Faster CSS optimization
    optimizeCss: true
  },
};

module.exports = nextConfig; 