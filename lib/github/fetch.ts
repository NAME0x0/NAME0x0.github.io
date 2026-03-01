import { GITHUB_USERNAME } from "@/lib/data/curated";
import { fetchGitHubSnapshot } from "@/lib/github/client";
import { toPortfolioDataset } from "@/lib/github/transform";
import type { GitHubSnapshot, PortfolioDataset } from "@/lib/github/types";

const SNAPSHOT_PATH = "/data/github-snapshot.json";

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
  username: string = GITHUB_USERNAME,
  signal?: AbortSignal
): Promise<PortfolioDataset> {
  const { snapshot, rateLimit } = await fetchGitHubSnapshot(username, {
    signal,
  });

  return {
    ...toPortfolioDataset(
      {
        generatedAt: snapshot.generatedAt,
        profile: snapshot.profile,
        repositories: snapshot.repositories,
        languageDistribution: snapshot.languageDistribution,
      },
      "live"
    ),
    rateLimit,
  };
}
