import { ImageResponse } from "next/og";
import { identity } from "@/content/identity";
import { getTierOneProjectBySlug, tierOneProjects } from "@/lib/content/projects";
import type { ProjectStatus } from "@/lib/content/schema";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type WorkOgImageProps = {
  params: {
    slug: string;
  };
};

const statusColors: Record<ProjectStatus, string> = {
  MEASURED: "#E3B341",
  LIVE: "#C4B5A0",
  SHIPPED: "#8A8578",
  "SHIPPED (MVP)": "#8A8578",
  "SPEC / IN PROGRESS": "#D08C5A",
};

function truncate(value: string, maxLength = 120): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trim()}…` : value;
}

export function generateStaticParams() {
  return tierOneProjects.map((project) => ({ slug: project.slug }));
}

export default function WorkOpenGraphImage({ params }: WorkOgImageProps) {
  const project = getTierOneProjectBySlug(params.slug) ?? tierOneProjects[0];

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
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8A8578", fontSize: 22 }}>
          <span>{identity.lockup}</span>
          <span style={{ color: statusColors[project.status] }}>{project.status}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ width: "100%", height: 2, background: "#C4B5A0" }} />
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>{project.name}</div>
          <div style={{ display: "flex", maxWidth: 980, fontSize: 30, lineHeight: 1.35, color: "#8A8578" }}>
            {truncate(project.tagline)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
