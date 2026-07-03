#!/usr/bin/env node
// Generates content/writing-meta.json from content/writing/*.mdx frontmatter.
// The /writing/[slug] OG image route runs on the edge runtime and cannot read
// the filesystem; it imports this JSON statically instead. Runs in prebuild so
// the file can never drift from the MDX sources.

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const writingDir = path.join(process.cwd(), "content", "writing");
const outputPath = path.join(process.cwd(), "content", "writing-meta.json");

const entries = await fs.readdir(writingDir);
const posts = [];

for (const entry of entries.filter((name) => name.endsWith(".mdx")).sort()) {
  const raw = await fs.readFile(path.join(writingDir, entry), "utf8");
  const { data } = matter(raw);

  if (!data.title || !data.description || !data.date) {
    console.error(`[writing-meta] ${entry}: frontmatter must include title, description, date`);
    process.exit(1);
  }

  posts.push({
    slug: entry.replace(/\.mdx$/, ""),
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
  });
}

posts.sort((a, b) => (a.date < b.date ? 1 : -1));
await fs.writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`[writing-meta] wrote ${posts.length} post(s) to content/writing-meta.json`);
