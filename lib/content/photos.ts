import fs from "node:fs";
import path from "node:path";

export type PhotoEntry = {
  src: string;
  kind: "professional" | "profile" | "goofy";
  alt: string;
};

const photoPattern = /^(professional|pfp_(\d+)|goofy_(\d+))\.(png|jpe?g|webp)$/i;

export function getPhotos(): PhotoEntry[] {
  const photosDir = path.join(process.cwd(), "public", "photos");

  if (!fs.existsSync(photosDir)) {
    return [];
  }

  return fs.readdirSync(photosDir)
    .map((file) => {
      const match = file.match(photoPattern);

      if (!match) {
        return null;
      }

      if (match[1].toLowerCase() === "professional") {
        return {
          src: `/photos/${file}`,
          kind: "professional" as const,
          alt: "professional headshot",
          order: 0,
        };
      }

      const profileIndex = match[2] ? Number(match[2]) : null;
      const goofyIndex = match[3] ? Number(match[3]) : null;

      if (profileIndex !== null) {
        return {
          src: `/photos/${file}`,
          kind: "profile" as const,
          alt: `profile photo ${profileIndex}`,
          order: 100 + profileIndex,
        };
      }

      return {
        src: `/photos/${file}`,
        kind: "goofy" as const,
        alt: `off duty ${goofyIndex ?? 0}`,
        order: 200 + (goofyIndex ?? 0),
      };
    })
    .filter((photo): photo is PhotoEntry & { order: number } => photo !== null)
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...photo }) => photo);
}
