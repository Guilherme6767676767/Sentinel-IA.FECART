import { DashboardClient } from "./DashboardClient";
import { listAlerts } from "@/lib/db";
import { generateBriefing } from "@/services/briefingService";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const alerts = await listAlerts();
  const briefing = generateBriefing(alerts);

  return <DashboardClient initialAlerts={alerts} initialBriefing={briefing} />;
}
