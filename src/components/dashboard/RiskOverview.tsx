import { AlertTriangle, CheckCircle2, RadioTower } from "lucide-react";
import type { Alert } from "@/types/alert";
import { priorityWeight } from "@/lib/utils";

export function RiskOverview({ alerts }: { alerts: Alert[] }) {
  const averageRisk = alerts.length
    ? Math.round(alerts.reduce((total, alert) => total + alert.riskScore, 0) / alerts.length)
    : 0;
  const highPriority = alerts.filter((alert) => priorityWeight(alert.priority) >= 3).length;
  const resolved = alerts.filter((alert) => alert.status === "Resolvido").length;

  const cards = [
    {
      label: "Indice de risco",
      value: `${averageRisk}%`,
      detail: averageRisk >= 70 ? "Atencao operacional" : "Operacao estavel",
      icon: AlertTriangle,
      color: "text-sentinel-orange"
    },
    {
      label: "Alta prioridade",
      value: highPriority,
      detail: "Alertas exigem triagem",
      icon: RadioTower,
      color: "text-sentinel-red"
    },
    {
      label: "Resolvidos",
      value: resolved,
      detail: "Retorno para comunidade",
      icon: CheckCircle2,
      color: "text-sentinel-green"
    }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="sentinel-panel rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
            <card.icon className={`size-5 ${card.color}`} />
          </div>
          <p className={`font-display text-3xl font-black ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-sm text-slate-400">{card.detail}</p>
        </div>
      ))}
    </div>
  );
}
