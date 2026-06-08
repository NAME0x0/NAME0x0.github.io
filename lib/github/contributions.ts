const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const DEFAULT_TIMEOUT_MS = 9000;
const CONTRIBUTION_LOOKBACK_DAYS = 365;

interface ContributionOptions {
  token?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

async function requestGraphQL(
  query: string,
  variables: Record<string, unknown>,
  options: ContributionOptions
): Promise<unknown> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const relayAbort = () => controller.abort();
  options.signal?.addEventListener("abort", relayAbort, { once: true });

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed (${response.status})`);
    }

    const payload = (await response.json()) as {
      data?: unknown;
      errors?: { message: string }[];
    };

    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error) => error.message).join("; "));
    }

    return payload.data;
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", relayAbort);
  }
}

function parseContributionMarkup(input: string): number | null {
  const lastYearMatch = input.match(
    /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i
  );
  if (lastYearMatch) {
    return Number.parseInt(lastYearMatch[1].replace(/,/g, ""), 10);
  }

  const dataCountMatches = [...input.matchAll(/data-count="(\d+)"/g)];
  if (dataCountMatches.length > 0) {
    return dataCountMatches.reduce(
      (sum, [, count]) => sum + Number.parseInt(count, 10),
      0
    );
  }

  return null;
}

/**
 * Total contributions over the trailing year. Uses the authenticated GraphQL
 * contribution calendar when a token is present, otherwise scrapes the public
 * contributions fragment as a best-effort fallback. Returns null on failure so
 * callers can fall back to a snapshot value rather than rendering a hard zero.
 */
export async function fetchContributionCount(
  login: string,
  token?: string,
  options: Omit<ContributionOptions, "token"> = {}
): Promise<number | null> {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - CONTRIBUTION_LOOKBACK_DAYS);

  if (token) {
    try {
      const data = (await requestGraphQL(
        `
          query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }
        `,
        { login, from: from.toISOString(), to: to.toISOString() },
        { token, ...options }
      )) as {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: { totalContributions?: number };
          };
        };
      };

      const total =
        data?.user?.contributionsCollection?.contributionCalendar
          ?.totalContributions;
      if (typeof total === "number" && Number.isFinite(total)) {
        return total;
      }
    } catch {
      // Fall through to the public markup scrape below.
    }
  }

  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(login)}/contributions`,
      {
        headers: { Accept: "image/svg+xml,text/html;q=0.9,*/*;q=0.8" },
        cache: "no-store",
        signal: options.signal,
      }
    );
    if (!response.ok) {
      return null;
    }
    return parseContributionMarkup(await response.text());
  } catch {
    return null;
  }
}
