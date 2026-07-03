import type { ProjectStatus } from "@/lib/content/schema";

type StatusBadgeProps = {
  status: ProjectStatus;
};

const statusClasses: Record<ProjectStatus, string> = {
  MEASURED: "border-signal text-signal",
  LIVE: "border-bone text-bone",
  SHIPPED: "border-dim text-dim",
  "SHIPPED (MVP)": "border-dim text-dim",
  "SPEC / IN PROGRESS": "border-ember text-ember",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isSpec = status === "SPEC / IN PROGRESS";

  return (
    <span
      className={`inline-flex items-center border px-2 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.14em] ${statusClasses[status]}`}
      title={isSpec ? "honestly labeled" : undefined}
    >
      {status}
    </span>
  );
}
