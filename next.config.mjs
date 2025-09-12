/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  trailingSlash: true, // Required for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: process.env.NODE_ENV === 'production' ? '' : '', // Set to repo name if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '', // Set to repo name if needed
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["gsap", "three"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

export default nextConfig;

