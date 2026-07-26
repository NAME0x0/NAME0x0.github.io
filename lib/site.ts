// Canonical origin for the site. Everything that emits an absolute URL —
// metadataBase, JSON-LD, robots, sitemap, RSS — reads it from here so the four
// of them can never drift apart again.
export const SITE_URL = "https://portfolio.afsah.xyz";

// Hosts that used to be canonical and now 308 here (see next.config.mjs).
export const LEGACY_HOST = "name0x0.vercel.app";
