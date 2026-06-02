import { NextResponse } from "next/server";
import { listAlerts } from "@/lib/db";
import { generateBriefing } from "@/services/briefingService";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = await listAlerts();
  return NextResponse.json({ briefing: generateBriefing(alerts) });
}
