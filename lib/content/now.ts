import { readFileSync } from "node:fs";
import path from "node:path";
import { NowSchema, type Now } from "@/lib/content/schema";

type FrontmatterValue = string | string[];

function parseInlineArray(value: string): string[] {
  const parsed = JSON.parse(value) as unknown;

  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error("Expected an inline string array in now.md frontmatter.");
  }

  return parsed;
}

function parseScalar(value: string): FrontmatterValue {
  const trimmed = value.trim();

  if (trimmed.startsWith("[")) {
    return parseInlineArray(trimmed);
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontmatter(frontmatter: string): Record<string, FrontmatterValue> {
  return frontmatter.split(/\r?\n/).reduce<Record<string, FrontmatterValue>>((parsed, line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return parsed;
    }

    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(`Invalid now.md frontmatter line: ${line}`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1);

    return {
      ...parsed,
      [key]: parseScalar(value),
    };
  }, {});
}

export function parseNowMarkdown(markdown: string): Now {
  if (!markdown.startsWith("---")) {
    throw new Error("now.md must start with YAML frontmatter.");
  }

  const closingIndex = markdown.indexOf("\n---", 3);

  if (closingIndex === -1) {
    throw new Error("now.md frontmatter is missing a closing delimiter.");
  }

  const frontmatter = markdown.slice(3, closingIndex).trim();
  const body = markdown.slice(closingIndex + 4).trim();

  return NowSchema.parse({
    ...parseFrontmatter(frontmatter),
    body,
  });
}

export function readNow(): Now {
  const markdown = readFileSync(path.join(process.cwd(), "content", "now.md"), "utf8");

  return parseNowMarkdown(markdown);
}

export const now = readNow();
