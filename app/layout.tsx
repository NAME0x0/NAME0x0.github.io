import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { identity } from "@/content/identity";
import { SITE_URL } from "@/lib/site";
import { CursorDot } from "@/components/site/CursorDot";
import { Footer } from "@/components/site/Footer";
import { FluidInkMount } from "@/components/site/FluidInkMount";
import { KineticWall } from "@/components/site/KineticWall";
import { PillNav } from "@/components/site/PillNav";
import { ProgressHairline } from "@/components/site/ProgressHairline";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const monoFont = GeistMono;

const siteUrl = SITE_URL;
const siteDescription =
  "Systems & ML engineer. I build machines that think, on hardware that shouldn't be able to.";

export const metadata: Metadata = {
  title: {
    default: "Muhammad Afsah Mumtaz \u2014 NAME0x0",
    template: "%s \u00b7 Muhammad Afsah Mumtaz \u2014 NAME0x0",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Muhammad Afsah Mumtaz \u2014 NAME0x0",
    description: siteDescription,
    url: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

type PersonJsonLd = {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  alternateName: string;
  email: string;
  jobTitle: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  alumniOf: {
    "@type": "CollegeOrUniversity";
    name: string;
  };
  sameAs: string[];
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Afsah Mumtaz",
  alternateName: "NAME0x0",
  email: "mailto:m.afsah.279@gmail.com",
  jobTitle: "Systems & ML Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "UAE",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Middlesex University Dubai",
  },
  sameAs: [
    "https://github.com/NAME0x0",
    "https://www.linkedin.com/in/muhammad-afsah-mumtaz/",
    "https://x.com/NAME0X0_0",
    "https://huggingface.co/NAME0x0",
  ],
} satisfies PersonJsonLd;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Muhammad Afsah Mumtaz — NAME0x0",
  url: siteUrl,
  description: siteDescription,
  inLanguage: "en",
  author: { "@type": "Person", name: "Muhammad Afsah Mumtaz", alternateName: "NAME0x0" },
} as const;

const personJsonLdText = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");
const websiteJsonLdText = JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} ${monoFont.variable}`}
    >
      <body className="bg-void text-ink font-body antialiased">
        {/* Exception to the no-dangerouslySetInnerHTML rule: JSON-LD must be raw text
            inside <script> — React-escaped children render &quot; entities crawlers
            do not decode, invalidating the JSON. Input is JSON.stringify of
            build-time constants with < escaped; no user input reaches this. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLdText }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLdText }} />
        <KineticWall />
        <FluidInkMount />
        <CursorDot />
        <ProgressHairline />
        <PillNav lockup={identity.lockup} socials={identity.socials} />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
