import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const writingDirectory = path.join(process.cwd(), "content", "writing");
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const WritingFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: dateSchema,
    tags: z.array(z.string().min(1)).default([]),
    sourceGist: z.string().url().optional(),
    updated: dateSchema.optional(),
  })
  .strict();

export type WritingFrontmatter = z.infer<typeof WritingFrontmatterSchema>;

export type WritingPost = {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: string;
  readingMinutes: number;
};

function getWordCount(content: string): number {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function getReadingMinutes(content: string): number {
  return Math.max(1, Math.ceil(getWordCount(content) / 200));
}

function getPostFromFile(filename: string): WritingPost {
  const raw = fs.readFileSync(path.join(writingDirectory, filename), "utf8");
  const parsed = matter(raw);
  const frontmatter = WritingFrontmatterSchema.parse(parsed.data);

  return {
    slug: filename.replace(/\.mdx$/, ""),
    frontmatter,
    content: parsed.content.trim(),
    readingMinutes: getReadingMinutes(parsed.content),
  };
}

export function getAllPosts(): WritingPost[] {
  return fs
    .readdirSync(writingDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map(getPostFromFile)
    .sort((a, b) => Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date));
}

export function getPostBySlug(slug: string): WritingPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
