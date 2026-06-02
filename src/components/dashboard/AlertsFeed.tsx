import { Clock3, Radio } from "lucide-react";
import { priorityColor } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import type { Alert } from "@/types/alert";

export function AlertsFeed({ alerts }: { alerts: Alert[] }) {
  return (
    <section className="sentinel-panel flex min-h-0 flex-1 flex-col rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.18em] text-white">
          <Radio className="size-4 text-sentinel-cyan" />
          Alertas recentes
        </h2>
        <span className="rounded-full bg-sentinel-cyan/10 px-3 py-1 text-xs font-bold text-sentinel-cyan">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-md border border-sentinel-line bg-slate-950/42 p-3">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-white">{alert.category}</p>
                <p className="text-sm text-slate-400">{alert.location}</p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: `${priorityColor[alert.priority]}22`,
                  color: priorityColor[alert.priority]
                }}
              >
                {alert.priority}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-slate-300">{alert.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{alert.protocol}</span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {formatTime(alert.createdAt)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
