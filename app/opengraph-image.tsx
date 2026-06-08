import { ImageResponse } from "next/og";

// Social preview card (LinkedIn / X / iMessage / Slack / etc). Rendered on the
// server into a 1200x630 PNG; Next wires the og:image + twitter:image meta tags
// automatically. Mirrors the "Sovereign Void" palette.
// Edge runtime is the supported path for next/og image generation (avoids a
// nodejs prerender quirk and renders identically on Vercel).
export const runtime = "edge";
export const alt = "Muhammad Afsah Mumtaz — Systems Architect · AI Engineer · OS Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#E8E4DE",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          border: "1px solid #3A3832",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9B9589",
          }}
        >
          <span>{"// SYS.INIT"}</span>
          <span>SOVEREIGN_ARCHITECT</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -3,
              maxWidth: 1040,
            }}
          >
            MUHAMMAD AFSAH MUMTAZ
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              letterSpacing: 2,
              color: "#C4B5A0",
            }}
          >
            Systems Architect · AI Engineer · OS Developer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            color: "#9B9589",
          }}
        >
          <span>name0x0.vercel.app</span>
          <span>NAME0x0</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
