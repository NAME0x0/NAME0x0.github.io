import {
  curatedProjectOverrides,
  languageColors,
  layerKeywords,
  SOVEREIGN_STACK,
} from "@/lib/data/curated";
import type {
  GitHubRepository,
  LanguageShare,
  PortfolioDataSource,
  PortfolioDataset,
  PortfolioRepo,
  ProjectLayer,
} from "@/lib/github/types";

function cleanText(input: string): string {
  return input
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€/g, "\"")
    .replace(/Â·/g, "·")
    .replace(/Â/g, "")
    .trim();
}

function slug(value: string): string {
  return value.toLowerCase();
}

function pickLayerFromContent(repo: GitHubRepository): ProjectLayer {
  const haystack = [repo.name, repo.description, repo.language, ...repo.topics]
    .join(" ")
    .toLowerCase();

  for (const layer of SOVEREIGN_STACK.map((entry) => entry.layer)) {
    const keywords = layerKeywords[layer] ?? [];
    if (keywords.some((token) => haystack.includes(token))) {
      return layer;
    }
  }

  if (repo.language === "Rust" || repo.language === "C++") {
    return "foundation";
  }

  if (repo.language === "TypeScript" || repo.language === "JavaScript") {
    return "visualization";
  }

  if (repo.language === "Python") {
    return "intelligence";
  }

  return "other";
}

export function toPortfolioRepo(repo: GitHubRepository, source: PortfolioDataSource): PortfolioRepo {
  const override = curatedProjectOverrides[repo.name];

  return {
    ...repo,
    description: cleanText((override?.description ?? repo.description ?? "").trim()),
    language: override?.language ?? repo.language ?? "Unknown",
    homepage: override?.homepage ?? repo.homepage,
    topics: [...new Set([...(repo.topics ?? []), ...(override?.topics ?? [])])],
    layer: override?.layer ?? pickLayerFromContent(repo),
    featured: override?.featured ?? false,
    source,
  };
}

export function normalizeRepositories(
  repositories: GitHubRepository[],
  source: PortfolioDataSource
): PortfolioRepo[] {
  return repositories
    .map((repo) => toPortfolioRepo(repo, source))
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }

      if (a.stars !== b.stars) {
        return b.stars - a.stars;
      }

      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });
}

export function buildLanguageDistribution(repositories: GitHubRepository[]): LanguageShare[] {
  const counts = new Map<string, number>();

  for (const repo of repositories) {
    if (repo.fork) {
      continue;
    }

    const key = repo.language || "Unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return [];
  }

  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      percentage: Number(((count / total) * 100).toFixed(1)),
      color: languageColors[name] ?? languageColors.Unknown,
    }));

  const sum = rows.reduce((acc, row) => acc + row.percentage, 0);
  if (rows.length > 0 && sum !== 100) {
    rows[0] = {
      ...rows[0],
      percentage: Number((rows[0].percentage + (100 - sum)).toFixed(1)),
    };
  }

  return rows;
}

export function toPortfolioDataset(
  input: {
    generatedAt: string;
    profile: PortfolioDataset["profile"];
    repositories: GitHubRepository[];
    languageDistribution?: LanguageShare[];
  },
  source: PortfolioDataSource
): PortfolioDataset {
  const repositories = normalizeRepositories(input.repositories, source);
  const languageDistribution =
    input.languageDistribution && input.languageDistribution.length > 0
      ? input.languageDistribution
      : buildLanguageDistribution(repositories);

  return {
    generatedAt: input.generatedAt,
    profile: input.profile,
    repositories,
    languageDistribution,
    source,
  };
}

export function getLayerCounts(repositories: PortfolioRepo[]): Record<ProjectLayer, number> {
  return repositories.reduce(
    (acc, repo) => {
      acc[repo.layer] += 1;
      return acc;
    },
    {
      foundation: 0,
      interface: 0,
      intelligence: 0,
      visualization: 0,
      tools: 0,
      other: 0,
    } satisfies Record<ProjectLayer, number>
  );
}

export function getFlagshipRepos(repositories: PortfolioRepo[]): PortfolioRepo[] {
  const prioritized = repositories.filter((repo) => repo.featured);
  const order = new Map(Object.keys(curatedProjectOverrides).map((name, index) => [slug(name), index]));

  return prioritized.sort((a, b) => {
    const aOrder = order.get(slug(a.name));
    const bOrder = order.get(slug(b.name));

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    if (aOrder !== undefined) {
      return -1;
    }

    if (bOrder !== undefined) {
      return 1;
    }

    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}
