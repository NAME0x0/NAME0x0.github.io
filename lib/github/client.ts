import { buildLanguageDistribution } from "@/lib/github/transform";
import type {
  GitHubApiRepositoryResponse,
  GitHubApiUserResponse,
  GitHubProfile,
  GitHubRepository,
  GitHubSnapshot,
  RateLimitInfo,
} from "@/lib/github/types";

const GITHUB_API_BASE_URL = "https://api.github.com";
const DEFAULT_TIMEOUT_MS = 9000;
const DEFAULT_PER_PAGE = 100;

export class GitHubApiError extends Error {
  readonly statusCode: number;
  readonly rateLimit: RateLimitInfo;

  constructor(message: string, statusCode: number, rateLimit: RateLimitInfo) {
    super(message);
    this.name = "GitHubApiError";
    this.statusCode = statusCode;
    this.rateLimit = rateLimit;
  }
}

export class GitHubRateLimitError extends GitHubApiError {
  constructor(message: string, statusCode: number, rateLimit: RateLimitInfo) {
    super(message, statusCode, rateLimit);
    this.name = "GitHubRateLimitError";
  }
}

interface RequestOptions {
  token?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

interface RequestResult<TData> {
  data: TData;
  rateLimit: RateLimitInfo;
}

interface FetchSnapshotOptions extends RequestOptions {
  includeForks?: boolean;
}

export interface FetchSnapshotResult {
  snapshot: GitHubSnapshot;
  rateLimit: RateLimitInfo;
}

function cleanText(value: string): string {
  return value
    .replace(/^"(.*)"$/, "$1")
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/Â·/g, "·")
    .replace(/Â/g, "")
    .trim();
}

function parseRateLimit(headers: Headers): RateLimitInfo {
  const remainingRaw = headers.get("x-ratelimit-remaining");
  const resetRaw = headers.get("x-ratelimit-reset");

  const remaining = remainingRaw !== null ? Number(remainingRaw) : null;
  const resetEpoch = resetRaw !== null ? Number(resetRaw) : null;

  return {
    remaining: Number.isFinite(remaining) ? remaining : null,
    resetAt:
      resetEpoch !== null && Number.isFinite(resetEpoch)
        ? new Date(resetEpoch * 1000).toISOString()
        : null,
  };
}

function normalizeRepository(apiRepo: GitHubApiRepositoryResponse): GitHubRepository {
  return {
    id: apiRepo.id,
    name: apiRepo.name,
    description: cleanText(apiRepo.description ?? ""),
    language: apiRepo.language ?? "Unknown",
    stars: apiRepo.stargazers_count,
    url: apiRepo.html_url,
    homepage: apiRepo.homepage || undefined,
    topics: Array.isArray(apiRepo.topics) ? [...apiRepo.topics] : [],
    fork: apiRepo.fork,
    archived: apiRepo.archived,
    pushedAt: apiRepo.pushed_at,
    updatedAt: apiRepo.updated_at,
  };
}

function normalizeProfile(apiUser: GitHubApiUserResponse): GitHubProfile {
  return {
    username: apiUser.login,
    displayName: cleanText(apiUser.name ?? apiUser.login),
    avatarUrl: apiUser.avatar_url,
    bio: apiUser.bio ?? undefined,
    company: apiUser.company ?? undefined,
    location: apiUser.location ?? undefined,
    publicRepos: apiUser.public_repos,
    followers: apiUser.followers,
    following: apiUser.following,
    memberSince: new Date(apiUser.created_at).getUTCFullYear().toString(),
    createdAt: apiUser.created_at,
  };
}

function mergeRateLimit(a: RateLimitInfo, b: RateLimitInfo): RateLimitInfo {
  if (a.remaining === null) {
    return b;
  }
  if (b.remaining === null) {
    return a;
  }
  return a.remaining <= b.remaining ? a : b;
}

async function requestGitHubJson<TData>(
  path: string,
  options: RequestOptions = {}
): Promise<RequestResult<TData>> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const relayAbort = () => controller.abort();

  options.signal?.addEventListener("abort", relayAbort, { once: true });

  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const rateLimit = parseRateLimit(response.headers);

    if (!response.ok) {
      const message = `GitHub API request failed (${response.status}) for ${path}`;
      const isRateLimited = response.status === 403 && rateLimit.remaining === 0;

      if (isRateLimited) {
        throw new GitHubRateLimitError(message, response.status, rateLimit);
      }

      throw new GitHubApiError(message, response.status, rateLimit);
    }

    const data = (await response.json()) as TData;
    return { data, rateLimit };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`GitHub request timed out after ${timeoutMs}ms for ${path}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", relayAbort);
  }
}

export async function fetchGitHubSnapshot(
  username: string,
  options: FetchSnapshotOptions = {}
): Promise<FetchSnapshotResult> {
  const [userResponse, reposResponse] = await Promise.all([
    requestGitHubJson<GitHubApiUserResponse>(`/users/${username}`, options),
    requestGitHubJson<GitHubApiRepositoryResponse[]>(
      `/users/${username}/repos?per_page=${DEFAULT_PER_PAGE}&sort=updated&type=owner`,
      options
    ),
  ]);

  const repositories = reposResponse.data
    .filter((repo) => (options.includeForks ? true : !repo.fork))
    .map(normalizeRepository)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  const snapshot: GitHubSnapshot = {
    generatedAt: new Date().toISOString(),
    username,
    profile: normalizeProfile(userResponse.data),
    repositories,
    languageDistribution: buildLanguageDistribution(repositories),
  };

  return {
    snapshot,
    rateLimit: mergeRateLimit(userResponse.rateLimit, reposResponse.rateLimit),
  };
}
