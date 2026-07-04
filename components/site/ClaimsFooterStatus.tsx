import { getClaimsReceipts } from "@/lib/content/claims";

function relativeFromNow(isoDate: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function ClaimsFooterStatus() {
  const receipts = getClaimsReceipts();
  const verifiedCount = receipts.filter((receipt) => receipt.status === "verified").length;
  const verifiedAt = receipts[0]?.verifiedAt;

  if (!verifiedAt) {
    return null;
  }

  const allVerified = verifiedCount === receipts.length;
  const relative = relativeFromNow(verifiedAt);

  return (
    <p
      className="font-mono text-xs uppercase tracking-[0.12em] text-dim"
      title="Every number on this site is checked against its repo README at build time; a mismatch fails the build."
    >
      {allVerified ? `${verifiedCount}/${receipts.length} claims verified · ${relative}` : `claims unverified — last verified ${relative}`}
    </p>
  );
}
