import { GITHUB_USERNAME } from "@/lib/data/curated";
import { toPortfolioDataset } from "@/lib/github/transform";
import type { GitHubSnapshot, PortfolioDataset } from "@/lib/github/types";

const SNAPSHOT_PATH = "/data/github-snapshot.json";
const LIVE_API_PATH = "/api/github";

export async function fetchSnapshotDataset(
  username: string = GITHUB_USERNAME,
  signal?: AbortSignal
): Promise<PortfolioDataset> {
  const response = await fetch(SNAPSHOT_PATH, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Snapshot request failed (${response.status})`);
  }

  const snapshot = (await response.json()) as GitHubSnapshot;

  if (!snapshot || !Array.isArray(snapshot.repositories)) {
    throw new Error("Snapshot payload is invalid");
  }

  return toPortfolioDataset(
    {
      generatedAt: snapshot.generatedAt,
      profile: snapshot.profile,
      repositories: snapshot.repositories,
      languageDistribution: snapshot.languageDistribution,
    },
    "snapshot"
  );
}

export async function fetchLiveDataset(
  _username: string = GITHUB_USERNAME,
  signal?: AbortSignal
): Promise<PortfolioDataset> {
  // Hit our own server route (token-backed, edge-cached) instead of
  // api.github.com directly. Keeps the token server-side and avoids the
  // unauthenticated 60 req/hr/IP client rate limit.
  const response = await fetch(LIVE_API_PATH, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Live GitHub request failed (${response.status})`);
  }

  const snapshot = (await response.json()) as GitHubSnapshot;

  if (!snapshot || !Array.isArray(snapshot.repositories)) {
    throw new Error("Live payload is invalid");
  }

  return toPortfolioDataset(
    {
      generatedAt: snapshot.generatedAt,
      profile: snapshot.profile,
      repositories: snapshot.repositories,
      languageDistribution: snapshot.languageDistribution,
    },
    "live"
  );
}
