import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = GeistMono;

export const metadata: Metadata = {
  title: "Muhammad Afsah Mumtaz \u2014 Systems Architect",
  description:
    "I design sovereign computing systems across operating environments, AI workflows, and immersive interfaces.",
  metadataBase: new URL("https://name0x0.is-a.dev"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Muhammad Afsah Mumtaz \u2014 Systems Architect",
    description:
      "I design sovereign computing systems across operating environments, AI workflows, and immersive interfaces.",
    url: "https://name0x0.is-a.dev",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} ${monoFont.variable}`}
    >
      <body className="bg-void text-ink font-body antialiased">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
