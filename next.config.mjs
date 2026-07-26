/** @type {import('next').NextConfig} */
// 'unsafe-inline' for script-src is a documented compromise: SSG pages cannot carry per-request nonces, and hashing Next's own inline RSC scripts is not maintainable.
// 'wasm-unsafe-eval' permits WebAssembly ONLY (not JS eval) — required by the
// meshopt decoder that unpacks the compressed GLB; blob: in connect-src/img-src
// covers GLTFLoader's same-document object URLs for embedded textures.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com",
  "font-src 'self'",
  "connect-src 'self' blob: https://api.github.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

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
  // The .vercel.app production hostname is system-assigned and cannot be set to
  // redirect from the dashboard, so the old canonical is retired here instead.
  // Host-matched, so preview deployments (*-git-*.vercel.app) are unaffected.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "name0x0.vercel.app" }],
        destination: "https://portfolio.afsah.xyz/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

