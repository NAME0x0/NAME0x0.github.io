#!/usr/bin/env node
// One-time (re-runnable) photo processor for the Human-section deck.
//
// Personal phone photos carry EXIF — including GPS location. Publishing them
// raw would leak where they were taken. This script:
//   1. Moves any freshly-dropped originals into assets/source/photos/ (gitignored)
//      so the full-resolution files are preserved but never committed.
//   2. Writes web-ready copies into public/photos/: metadata fully stripped,
//      long edge capped, re-encoded at a sensible quality.
//
// Run: node scripts/process-photos.mjs   (also runs in prebuild)

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public", "photos");
const sourceDir = path.join(process.cwd(), "assets", "source", "photos");

const MAX_EDGE = 1280; // ~2x retina for the ~350px display card
const QUALITY = 82;
const NAME_PATTERN = /^(professional|pfp_\d+|goofy_\d+)\.(png|jpe?g|webp)$/i;
// A processed file is marked by this EXIF-free re-encode; we detect "already
// processed" by width, so re-runs are cheap and idempotent.

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(publicDir))) {
    console.log("[photos] no public/photos directory; nothing to do");
    return;
  }

  await fs.mkdir(sourceDir, { recursive: true });

  const files = (await fs.readdir(publicDir)).filter((f) => NAME_PATTERN.test(f));

  if (files.length === 0) {
    console.log("[photos] no matching photos found");
    return;
  }

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    const publicPath = path.join(publicDir, file);
    const sourcePath = path.join(sourceDir, file);

    // Preserve the original once (first time we see it).
    if (!(await exists(sourcePath))) {
      await fs.copyFile(publicPath, sourcePath);
    }

    const input = await fs.readFile(sourcePath); // always process from the pristine original
    const image = sharp(input, { failOn: "none" }).rotate(); // rotate() bakes EXIF orientation before we strip it
    const meta = await image.metadata();

    const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
    const alreadyWebReady =
      longEdge > 0 && longEdge <= MAX_EDGE + 1 && (await fs.readFile(publicPath)).length < 400_000;

    // Re-encode from source regardless — cheap, guarantees metadata is gone.
    const pipeline = image
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true });
    // .jpeg() + no .withMetadata() => all EXIF/GPS/ICC dropped by default.

    const out = await pipeline.toBuffer();
    await fs.writeFile(publicPath, out);

    if (alreadyWebReady) {
      skipped += 1;
    } else {
      processed += 1;
    }
  }

  console.log(
    `[photos] ${files.length} photo(s): re-encoded metadata-stripped web copies (${processed} resized, ${skipped} already small); originals preserved in assets/source/photos/`,
  );
}

main().catch((error) => {
  console.error("[photos] failed:", error);
  process.exit(1);
});
