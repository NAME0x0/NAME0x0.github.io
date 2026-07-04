import type { ProjectMetric } from "@/lib/content/schema";

type MetricsTableProps = {
  metrics: ProjectMetric[];
};

export function MetricsTable({ metrics }: MetricsTableProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-faint">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-faint text-dim">
          <tr>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Metric</th>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Value</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={`${metric.label}-${metric.value}`} data-reveal="row" className="border-b border-faint/70 last:border-0">
              <th className="px-4 py-3 font-body font-normal text-ink">{metric.label}</th>
              <td className={`px-4 py-3 font-mono ${metric.verified ? "text-signal" : "text-dim"}`}>
                {metric.verified ? <span data-countup data-value={metric.value}>{metric.value}</span> : metric.value}
                {!metric.verified ? (
                  <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-dim">projected</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
