#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const username = process.env.GITHUB_USERNAME || "NAME0x0";
const token = process.env.GITHUB_TOKEN || "";
const outputPath = path.join(process.cwd(), "public", "data", "github-snapshot.json");
const timeoutMs = 12000;

const languageColors = {
  Rust: "#dea584",
  "C++": "#f34b7d",
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Batchfile: "#C1F12E",
  PowerShell: "#012456",
  Shell: "#89e051",
  Unknown: "#6e7681",
};

async function requestJson(pathname) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.github.com${pathname}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed ${response.status} ${pathname}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildLanguageDistribution(repositories) {
  const counts = new Map();

  for (const repo of repositories) {
    if (repo.fork) {
      continue;
    }

    const language = repo.language || "Unknown";
    counts.set(language, (counts.get(language) || 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (!total) {
    return [];
  }

  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      percentage: Number(((count / total) * 100).toFixed(1)),
      color: languageColors[name] || languageColors.Unknown,
    }));

  const sum = rows.reduce((value, row) => value + row.percentage, 0);
  if (rows.length > 0 && sum !== 100) {
    rows[0].percentage = Number((rows[0].percentage + (100 - sum)).toFixed(1));
  }

  return rows;
}

function cleanText(value) {
  return String(value || "")
    .replace(/^"(.*)"$/, "$1")
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/Â·/g, "·")
    .replace(/Â/g, "")
    .trim();
}

function normalizeSnapshot(user, repos) {
  const normalizedRepos = repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: cleanText(repo.description || ""),
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      url: repo.html_url,
      homepage: repo.homepage || undefined,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      fork: repo.fork,
      archived: repo.archived,
      pushedAt: repo.pushed_at,
      updatedAt: repo.updated_at,
    }))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return {
    generatedAt: new Date().toISOString(),
    username,
    profile: {
      username: user.login,
      displayName: cleanText(user.name || user.login),
      avatarUrl: user.avatar_url,
      bio: user.bio || undefined,
      company: user.company || undefined,
      location: user.location || undefined,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      memberSince: new Date(user.created_at).getUTCFullYear().toString(),
      createdAt: user.created_at,
    },
    repositories: normalizedRepos,
    languageDistribution: buildLanguageDistribution(normalizedRepos),
  };
}

async function readExistingSnapshot() {
  try {
    const raw = await fs.readFile(outputPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeSnapshot(snapshot) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

async function createFallbackSnapshot() {
  const now = new Date().toISOString();
  const fallbackRepos = [
    {
      id: 1,
      name: "MALD",
      description:
        "Terminal-first PKM with local AI retrieval and citation-backed answers, shipped as a single binary.",
      language: "Rust",
      stars: 0,
      url: "https://github.com/NAME0x0/MALD",
      topics: ["rust", "local-ai", "rag", "terminal"],
      fork: false,
      archived: false,
      pushedAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "MAVIS",
      description:
        "Rust-native shell replacement that merges terminal, file exploration, and system control.",
      language: "Rust",
      stars: 0,
      url: "https://github.com/NAME0x0/MAVIS",
      topics: ["rust", "windows-shell", "desktop-environment", "lua"],
      fork: false,
      archived: false,
      pushedAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      name: "AVA",
      description:
        "Local-first personal assistant with retrieval pipelines and controllable orchestration.",
      language: "Python",
      stars: 0,
      url: "https://github.com/NAME0x0/AVA",
      topics: ["python", "assistant", "llm", "ollama"],
      fork: false,
      archived: false,
      pushedAt: now,
      updatedAt: now,
    },
    {
      id: 4,
      name: "SMNTC",
      description:
        "Semantic motion and topography engine that abstracts WebGL behavior into intent-level tokens.",
      language: "TypeScript",
      stars: 0,
      url: "https://github.com/NAME0x0/SMNTC",
      topics: ["typescript", "webgl", "animation"],
      fork: false,
      archived: false,
      pushedAt: now,
      updatedAt: now,
    },
    {
      id: 5,
      name: "Tangled",
      description: "Synchronized WebGL scenes shared across browser contexts to explore linked state.",
      language: "JavaScript",
      stars: 0,
      url: "https://github.com/NAME0x0/Tangled",
      topics: ["webgl", "3d", "creative-coding"],
      fork: false,
      archived: false,
      pushedAt: now,
      updatedAt: now,
    },
  ];

  return {
    generatedAt: now,
    username,
    profile: {
      username,
      displayName: username,
      bio: "Local fallback snapshot",
      publicRepos: 0,
      followers: 0,
      following: 0,
      memberSince: "2022",
      createdAt: now,
    },
    repositories: fallbackRepos,
    languageDistribution: buildLanguageDistribution(fallbackRepos),
  };
}

async function main() {
  const existing = await readExistingSnapshot();

  try {
    const [user, repos] = await Promise.all([
      requestJson(`/users/${username}`),
      requestJson(`/users/${username}/repos?per_page=100&sort=updated&type=owner`),
    ]);

    const snapshot = normalizeSnapshot(user, repos);
    await writeSnapshot(snapshot);
    console.log(`[snapshot] updated ${outputPath} (${snapshot.repositories.length} repos)`);
  } catch (error) {
    if (existing) {
      console.warn(`[snapshot] fetch failed; keeping existing snapshot: ${error.message}`);
      return;
    }

    const fallback = await createFallbackSnapshot();
    await writeSnapshot(fallback);
    console.warn(`[snapshot] fetch failed; wrote fallback snapshot: ${error.message}`);
  }
}

main();
