import { ImageResponse } from "next/og";
import { identity } from "@/content/identity";

export const runtime = "edge";
export const alt = identity.lockup;
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
          justifyContent: "center",
          background: "#000000",
          color: "#E8E4DE",
          padding: "80px",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        <div style={{ width: "100%", height: 2, background: "#C4B5A0", marginBottom: 56 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {identity.lockup}
          </div>
          <div style={{ display: "flex", maxWidth: 920, fontSize: 30, lineHeight: 1.35, color: "#8A8578" }}>
            {identity.positioning}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
