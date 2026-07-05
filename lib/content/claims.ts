import { z } from "zod";
import claimsSource from "@/content/claims.json";
import claimsStatusSource from "@/public/data/claims-status.json";

const ClaimSchema = z
  .object({
    id: z.string().min(1),
    value: z.string().min(1),
    repo: z.string().min(1),
    pattern: z.string().min(1),
    where: z.literal("readme"),
  })
  .strict();

const ClaimsFileSchema = z
  .object({
    claims: z.array(ClaimSchema).length(14),
  })
  .strict();

const ClaimResultSchema = z
  .object({
    id: z.string().min(1),
    repo: z.string().min(1),
    expected: z.string().min(1),
    where: z.literal("readme"),
    status: z.enum(["PASS", "FAIL"]),
  })
  .strict();

const ClaimsStatusSchema = z
  .object({
    verifiedAt: z.string().datetime(),
    status: z.enum(["verified", "unverified"]),
    results: z.array(ClaimResultSchema).optional(),
  })
  .strict();

const displayLabelById: Record<string, (value: string) => string> = {
  "ava-arc-challenge": (value) => `ARC-C ${value}%`,
  "ava-arc-easy": (value) => `ARC-E ${value}%`,
  "ava-adapter-42mb": (value) => `Adapter ${value}`,
  "pantheon-brier": (value) => `Brier ${value}`,
  "pantheon-tests-python": (value) => `Python tests ${value}`,
  "pantheon-tests-solidity": (value) => `Solidity tests ${value}`,
  "omni-tests": (value) => `OMNI tests ${value}`,
  "ava-mmlu": (value) => `MMLU ${value}%`,
  "ava-gsm8k": (value) => `GSM8K ${value}%`,
  "ava-train-peak-vram": (value) => `Peak VRAM ${value}`,
  "pantheon-human-brier": (value) => `Human Brier ${value}`,
  "pantheon-llm-brier": (value) => `LLM Brier ${value}`,
  "omni-active-params": (value) => `Active params ${value}`,
  "omni-projected-throughput": (value) => `Throughput ${value}`,
};

export type ClaimReceipt = {
  id: string;
  label: string;
  value: string;
  repo: string;
  status: "verified" | "unverified";
  verifiedAt: string;
};

export function getClaimsReceipts(): ClaimReceipt[] {
  const claimsFile = ClaimsFileSchema.parse(claimsSource);
  const statusFile = ClaimsStatusSchema.parse(claimsStatusSource);
  const resultById = new Map(statusFile.results?.map((result) => [result.id, result]));

  return claimsFile.claims.map((claim) => {
    const result = resultById.get(claim.id);
    const verified = statusFile.status === "verified" && result?.status === "PASS";
    const label = displayLabelById[claim.id]?.(claim.value) ?? claim.value;

    return {
      id: claim.id,
      label,
      value: claim.value,
      repo: claim.repo,
      status: verified ? "verified" : "unverified",
      verifiedAt: statusFile.verifiedAt,
    };
  });
}
