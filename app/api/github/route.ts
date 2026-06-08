import { NextResponse } from "next/server";
import { GITHUB_USERNAME } from "@/lib/data/curated";
import { fetchGitHubSnapshot } from "@/lib/github/client";
import { fetchContributionCount } from "@/lib/github/contributions";

// The function runs on demand, but the response below is cached by Vercel's
// edge network via Cache-Control s-maxage. GitHub is therefore hit at most once
// per 30 min per region regardless of traffic, so we never trip rate limits.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_CONTROL = "public, s-maxage=1800, stale-while-revalidate=86400";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || GITHUB_USERNAME;

  try {
    const [{ snapshot }, contributions] = await Promise.all([
      fetchGitHubSnapshot(username, { token, timeoutMs: 9000 }),
      fetchContributionCount(username, token),
    ]);

    const payload = {
      ...snapshot,
      profile: {
        ...snapshot.profile,
        ...(contributions !== null ? { contributions } : {}),
      },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GitHub fetch failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
