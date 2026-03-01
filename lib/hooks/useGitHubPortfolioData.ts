"use client";

import useSWR from "swr";
import { GITHUB_USERNAME } from "@/lib/data/curated";
import { fetchLiveDataset, fetchSnapshotDataset } from "@/lib/github/fetch";
import type { PortfolioDataset } from "@/lib/github/types";

interface UseGitHubPortfolioDataResult {
  data: PortfolioDataset | null;
  isLoading: boolean;
  error: Error | null;
  isStaleFallback: boolean;
  refreshedAt: string | null;
}

export function useGitHubPortfolioData(
  username: string = GITHUB_USERNAME
): UseGitHubPortfolioDataResult {
  const snapshot = useSWR(["portfolio-snapshot", username], ([, user]) => fetchSnapshotDataset(user), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const live = useSWR(
    snapshot.data ? ["portfolio-live", username] : null,
    ([, user]) => fetchLiveDataset(user),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 1000 * 60 * 5,
    }
  );

  const data = live.data ?? snapshot.data ?? null;
  const isLoading = !snapshot.data && snapshot.isLoading;
  const error = data ? null : (live.error as Error | null) ?? (snapshot.error as Error | null) ?? null;
  const isStaleFallback = Boolean(snapshot.data) && !live.data;

  return {
    data,
    isLoading,
    error,
    isStaleFallback,
    refreshedAt: data?.generatedAt ?? null,
  };
}
