#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const claimsPath = path.join(process.cwd(), "content", "claims.json");
const statusPath = path.join(process.cwd(), "public", "data", "claims-status.json");
const token = process.env.GITHUB_TOKEN || "";
const timeoutMs = 12000;

class VerificationUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "VerificationUnavailableError";
  }
}

async function readClaimsRegistry() {
  const raw = await fs.readFile(claimsPath, "utf8");
  const registry = JSON.parse(raw);

  if (!registry || !Array.isArray(registry.claims)) {
    throw new Error("content/claims.json must contain a claims array.");
  }

  return registry.claims;
}

async function requestReadme(repo) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new VerificationUnavailableError(`GitHub README request failed ${response.status} for ${repo}`);
    }

    return response.text();
  } catch (error) {
    if (error instanceof VerificationUnavailableError) {
      throw error;
    }

    throw new VerificationUnavailableError(`GitHub README request failed for ${repo}: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function writeStatus(payload) {
  await fs.mkdir(path.dirname(statusPath), { recursive: true });
  await fs.writeFile(statusPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function uniqueRepos(claims) {
  return [...new Set(claims.map((claim) => claim.repo))];
}

function verifyClaims(claims, readmes) {
  return claims.map((claim) => {
    const readme = readmes.get(claim.repo) || "";
    const pattern = new RegExp(claim.pattern, "i");
    const passed = pattern.test(readme);

    return {
      id: claim.id,
      repo: claim.repo,
      expected: claim.value,
      where: claim.where,
      status: passed ? "PASS" : "FAIL",
    };
  });
}

function printSummary(results) {
  console.table(
    results.map((result) => ({
      claim: result.id,
      repo: result.repo,
      expected: result.expected,
      where: result.where,
      status: result.status,
    })),
  );
}

async function main() {
  const verifiedAt = new Date().toISOString();
  const claims = await readClaimsRegistry();
  const readmes = new Map();

  try {
    for (const repo of uniqueRepos(claims)) {
      readmes.set(repo, await requestReadme(repo));
    }
  } catch (error) {
    console.warn(`WARNING claims unverified — using last verified state: ${error.message}`);
    await writeStatus({ verifiedAt, status: "unverified" });
    return;
  }

  const results = verifyClaims(claims, readmes);
  printSummary(results);

  const failures = results.filter((result) => result.status === "FAIL");

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(
        `[claims] FAIL ${failure.id}: expected ${failure.expected} in ${failure.repo} ${failure.where}`,
      );
    }

    process.exitCode = 1;
    return;
  }

  await writeStatus({ verifiedAt, status: "verified", results });
  console.log(`[claims] verified ${results.length} claims`);
}

main().catch((error) => {
  console.error(`[claims] verifier crashed: ${error.message}`);
  process.exitCode = 1;
});
