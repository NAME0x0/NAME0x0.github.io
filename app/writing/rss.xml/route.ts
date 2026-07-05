import { getAllPosts } from "@/lib/content/writing";

export const dynamic = "force-static";

const siteUrl = "https://name0x0.vercel.app";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map((post) => {
      const url = `${siteUrl}/writing/${post.slug}`;

      return [
        "<item>",
        `<title>${escapeXml(post.frontmatter.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        `<pubDate>${new Date(`${post.frontmatter.date}T00:00:00.000Z`).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.frontmatter.description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    "<title>Muhammad Afsah Mumtaz — NAME0x0 · Writing</title>",
    `<link>${siteUrl}/writing</link>`,
    "<description>Writing by Muhammad Afsah Mumtaz — NAME0x0</description>",
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
