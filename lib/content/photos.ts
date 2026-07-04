import fs from "node:fs";
import path from "node:path";

export type PhotoEntry = {
  src: string;
  kind: "professional" | "profile" | "goofy";
  alt: string;
  width: number;
  height: number;
};

const photoPattern = /^(professional|pfp_(\d+)|goofy_(\d+))\.(png|jpe?g|webp)$/i;
const fallbackSize = { width: 1200, height: 1600 } as const;

function readPngDimensions(buffer: Buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readJpegDimensions(buffer: Buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);

    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readWebpDimensions(buffer: Buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }

  const chunk = buffer.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunk === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);

    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }

  return null;
}

function readImageDimensions(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  return readPngDimensions(buffer) ?? readJpegDimensions(buffer) ?? readWebpDimensions(buffer) ?? fallbackSize;
}

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

      const dimensions = readImageDimensions(path.join(photosDir, file));

      if (match[1].toLowerCase() === "professional") {
        return {
          src: `/photos/${file}`,
          kind: "professional" as const,
          alt: "professional headshot",
          ...dimensions,
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
          ...dimensions,
          order: 100 + profileIndex,
        };
      }

      return {
        src: `/photos/${file}`,
        kind: "goofy" as const,
        alt: `off duty ${goofyIndex ?? 0}`,
        ...dimensions,
        order: 200 + (goofyIndex ?? 0),
      };
    })
    .filter((photo): photo is PhotoEntry & { order: number } => photo !== null)
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...photo }) => photo);
}
