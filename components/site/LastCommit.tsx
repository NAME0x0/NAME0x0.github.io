import snapshot from "@/public/data/github-snapshot.json";

type RepositorySnapshot = {
  name?: string;
  pushedAt?: string;
};

function relativeFromNow(date: Date) {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
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

export function LastCommit() {
  const repositories = (snapshot.repositories ?? []) as RepositorySnapshot[];
  const latest = repositories.reduce<RepositorySnapshot | null>((current, repository) => {
    if (!repository.pushedAt) {
      return current;
    }

    if (!current?.pushedAt || new Date(repository.pushedAt) > new Date(current.pushedAt)) {
      return repository;
    }

    return current;
  }, null);

  if (!latest?.pushedAt) {
    return null;
  }

  return (
    <p className="font-mono text-xs uppercase tracking-[0.12em] text-dim" title={`${latest.name ?? "repo"} ${latest.pushedAt}`}>
      last commit: {relativeFromNow(new Date(latest.pushedAt))}
    </p>
  );
}
