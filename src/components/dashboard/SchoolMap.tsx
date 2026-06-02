import { MapPin } from "lucide-react";
import { priorityColor, priorityLabel, schoolMapPoints } from "@/lib/constants";
import type { Alert } from "@/types/alert";
import { priorityWeight } from "@/lib/utils";

export function SchoolMap({ alerts }: { alerts: Alert[] }) {
  const pointPriority = schoolMapPoints.map((point) => {
    const locationAlerts = alerts.filter((alert) => alert.location === point.id);
    const topAlert = locationAlerts.sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))[0];
    return { ...point, priority: topAlert?.priority, count: locationAlerts.length };
  });

  return (
    <section className="sentinel-panel scan-grid relative min-h-[520px] overflow-hidden rounded-lg">
      <div className="absolute left-4 top-4 z-10">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-sentinel-cyan">Mapa operacional</p>
        <h2 className="text-2xl font-black">Escola FECART</h2>
      </div>

      <div className="absolute inset-10 rounded-[2rem] border border-sentinel-cyan/20 bg-slate-950/30">
        <div className="absolute left-[14%] top-[18%] h-[22%] w-[28%] rounded-lg border border-slate-500/25 bg-slate-900/70" />
        <div className="absolute right-[12%] top-[18%] h-[22%] w-[28%] rounded-lg border border-slate-500/25 bg-slate-900/70" />
        <div className="absolute left-[26%] top-[45%] h-[22%] w-[35%] rounded-lg border border-sentinel-cyan/20 bg-sentinel-cyan/5" />
        <div className="absolute bottom-[12%] right-[9%] h-[26%] w-[30%] rounded-lg border border-slate-500/25 bg-slate-900/70" />
        <div className="absolute bottom-[12%] left-[8%] h-[16%] w-[24%] rounded-lg border border-slate-500/25 bg-slate-900/70" />
        <div className="absolute left-[50%] top-[10%] h-[70%] w-px bg-sentinel-cyan/20" />
        <div className="absolute left-[12%] top-[48%] h-px w-[76%] bg-sentinel-cyan/20" />
      </div>

      {pointPriority.map((point) => {
        const color = point.priority ? priorityColor[point.priority] : "#10b981";
        return (
          <div
            key={point.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className="group relative flex items-center justify-center">
              <span
                className="absolute size-12 rounded-full opacity-30 blur-md"
                style={{ backgroundColor: color }}
              />
              <span
                className="relative grid size-10 place-items-center rounded-full border border-white/50 shadow-glow"
                style={{ backgroundColor: `${color}33`, color }}
              >
                <MapPin className="size-5" />
              </span>
              <div className="absolute left-1/2 top-12 hidden w-52 -translate-x-1/2 rounded-md border border-sentinel-line bg-slate-950/95 p-3 text-sm shadow-panel group-hover:block">
                <p className="font-bold text-white">{point.label}</p>
                <p className="text-slate-400">{point.zone}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em]" style={{ color }}>
                  {point.priority ? priorityLabel[point.priority] : "Baixo risco"} · {point.count} alerta(s)
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 rounded-md border border-sentinel-line bg-black/35 p-3 backdrop-blur">
        {Object.entries(priorityLabel).map(([priority, label]) => (
          <div key={priority} className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: priorityColor[priority as keyof typeof priorityColor] }}
            />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
