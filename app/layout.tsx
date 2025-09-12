import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import { AvaChat } from "@/components/AvaChat";
import { StructuredData } from "@/components/StructuredData";

const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "Muhammad Afsah Mumtaz | AI Developer & Creative Technologist",
    template: "%s | Muhammad Afsah Mumtaz"
  },
  description:
    "Global AI developer and creative technologist with experience across 6 countries. Specializing in cinematic web experiences, machine learning, and interactive 3D graphics. Building tomorrow's tech today.",
  metadataBase: new URL("https://name0x0.is-a.dev"),
  keywords: [
    "AI Developer",
    "Machine Learning",
    "Creative Technologist", 
    "Three.js",
    "GSAP",
    "Next.js",
    "WebGL",
    "Interactive Design",
    "Portfolio",
    "Muhammad Afsah Mumtaz",
    "Full Stack Developer",
    "Global Developer"
  ],
  authors: [{ name: "Muhammad Afsah Mumtaz", url: "https://name0x0.is-a.dev" }],
  creator: "Muhammad Afsah Mumtaz",
  publisher: "Muhammad Afsah Mumtaz",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { 
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg"
  },
  manifest: "/manifest.json",
  alternates: { canonical: "https://name0x0.is-a.dev" },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Muhammad Afsah Mumtaz | AI Developer & Creative Technologist",
    description:
      "Global AI developer with experience across 6 countries. Specializing in cinematic web experiences, machine learning, and interactive 3D graphics.",
    url: "https://name0x0.is-a.dev",
    siteName: "Muhammad Afsah Mumtaz Portfolio",
    images: [
      { 
        url: "/icon.svg", 
        width: 512, 
        height: 512, 
        alt: "Muhammad Afsah Mumtaz - AI Developer & Creative Technologist",
        type: "image/svg+xml"
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@NAME0X0_0",
    creator: "@NAME0X0_0",
    title: "Muhammad Afsah Mumtaz | AI Developer & Creative Technologist",
    description:
      "Global AI developer with experience across 6 countries. Building tomorrow's tech today with cinematic web experiences and machine learning.",
    images: ["/icon.svg"],
  },
  verification: {
    google: "google-site-verification-code", // Add actual code when available
  },
  category: "Technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" />
        
        {/* Performance Hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Enhanced Theme Colors */}
        <meta name="theme-color" content="#0A0A0A" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#0A0A0A" media="(prefers-color-scheme: light)" />
        <meta name="msapplication-TileColor" content="#0A0A0A" />
        <meta name="msapplication-navbutton-color" content="#0A0A0A" />
        
        <StructuredData />
      </head>
      <body className="bg-obsidian text-silver antialiased font-body selection:bg-electric/30 selection:text-obsidian">
        {/* Accessibility Skip Link */}
        <a 
          href="#main" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-electric focus:text-obsidian focus:rounded focus:font-medium"
        >
          Skip to main content
        </a>
        
        {/* Loading Fallback */}
        <div id="loading-fallback" className="fixed inset-0 flex items-center justify-center bg-obsidian z-[9999]">
          <div className="w-8 h-8 border-2 border-gunmetal border-t-electric rounded-full animate-spin" role="status" aria-label="Loading..."></div>
        </div>
        
        {/* Main Content */}
        <div className="min-h-screen">
          {children}
        </div>
        
        {/* Chat Component */}
        <AvaChat />
        
        {/* Remove Loading Fallback */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              var fallback = document.getElementById('loading-fallback');
              if (fallback) {
                fallback.style.opacity = '0';
                fallback.style.transition = 'opacity 0.3s ease-out';
                setTimeout(function() { 
                  if (fallback.parentNode) fallback.parentNode.removeChild(fallback); 
                }, 300);
              }
            });
          `
        }} />
      </body>
    </html>
  );
}

