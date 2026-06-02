"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { AiBriefing } from "@/components/dashboard/AiBriefing";
import { CommandHeader } from "@/components/dashboard/CommandHeader";
import { ParticipationQrCode } from "@/components/dashboard/ParticipationQrCode";
import { RiskOverview } from "@/components/dashboard/RiskOverview";
import { SchoolMap } from "@/components/dashboard/SchoolMap";
import { useSocketAlerts } from "@/hooks/useSocketAlerts";
import { generateBriefing } from "@/services/briefingService";
import type { Alert } from "@/types/alert";

export function DashboardClient({ initialAlerts, initialBriefing }: { initialAlerts: Alert[]; initialBriefing: string }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [briefing, setBriefing] = useState(initialBriefing);

  const upsertAlert = useCallback((alert: Alert) => {
    setAlerts((current) => {
      const exists = current.some((item) => item.id === alert.id);
      const next = exists ? current.map((item) => (item.id === alert.id ? alert : item)) : [alert, ...current];
      return next.slice(0, 80);
    });
  }, []);

  useSocketAlerts(upsertAlert);

  useEffect(() => {
    setBriefing(generateBriefing(alerts));
  }, [alerts]);

  const riskLevel = useMemo(() => {
    const avg = alerts.length ? alerts.reduce((sum, alert) => sum + alert.riskScore, 0) / alerts.length : 0;
    if (avg >= 80) return "CRITICO";
    if (avg >= 65) return "ALTO";
    if (avg >= 45) return "MODERADO";
    return "BAIXO";
  }, [alerts]);

  return (
    <div className="flex min-h-screen flex-col">
      <CommandHeader alertCount={alerts.length} riskLevel={riskLevel} />
      <main className="grid flex-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
        <section className="flex min-w-0 flex-col gap-4">
          <RiskOverview alerts={alerts} />
          <SchoolMap alerts={alerts} />
          <AiBriefing briefing={briefing} />
        </section>
        <aside className="flex min-h-0 flex-col gap-4">
          <ParticipationQrCode />
          <AlertsFeed alerts={alerts} />
        </aside>
      </main>
    </div>
  );
}
