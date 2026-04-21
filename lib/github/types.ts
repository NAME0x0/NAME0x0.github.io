export type ProjectLayer =
  | "foundation"
  | "interface"
  | "intelligence"
  | "visualization"
  | "tools"
  | "other";

export type PortfolioDataSource = "live" | "snapshot";

export interface GitHubRepository {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  homepage?: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushedAt: string;
  updatedAt: string;
}

export interface GitHubProfile {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  location?: string;
  contributions?: number;
  publicRepos: number;
  followers: number;
  following: number;
  memberSince: string;
  createdAt: string;
}

export interface LanguageShare {
  name: string;
  percentage: number;
  color: string;
}

export interface RateLimitInfo {
  remaining: number | null;
  resetAt: string | null;
}

export interface GitHubSnapshot {
  generatedAt: string;
  username: string;
  profile: GitHubProfile;
  repositories: GitHubRepository[];
  languageDistribution: LanguageShare[];
}

export interface CuratedProjectOverride {
  layer: ProjectLayer;
  featured: boolean;
  description?: string;
  topics?: string[];
  language?: string;
  homepage?: string;
}

export type CuratedProjectOverrides = Record<string, CuratedProjectOverride>;

export interface PortfolioRepo extends GitHubRepository {
  layer: ProjectLayer;
  featured: boolean;
  source: PortfolioDataSource;
}

export interface PortfolioDataset {
  generatedAt: string;
  profile: GitHubProfile;
  repositories: PortfolioRepo[];
  languageDistribution: LanguageShare[];
  source: PortfolioDataSource;
  rateLimit?: RateLimitInfo;
}

export interface GitHubApiUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubApiRepositoryResponse {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  updated_at: string;
  size: number;
}
