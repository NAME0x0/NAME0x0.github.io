/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed on Vercel: full Next.js (Route Handlers + ISR), no static export.
  images: {
    // Avatar is a remote githubusercontent URL; keep unoptimized to avoid
    // configuring remotePatterns. Revisit to use Vercel image optimization.
    unoptimized: true,
  },
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

