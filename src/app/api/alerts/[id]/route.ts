import { NextResponse } from "next/server";
import { updateAlertStatus } from "@/lib/db";
import type { AlertStatus } from "@/types/alert";

const statuses: AlertStatus[] = ["Recebido", "Em analise", "Priorizado", "Equipe acionada", "Resolvido"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as { status?: AlertStatus };

  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Status invalido." }, { status: 400 });
  }

  const alert = await updateAlertStatus(params.id, body.status);

  if (!alert) {
    return NextResponse.json({ error: "Alerta nao encontrado." }, { status: 404 });
  }

  global.io?.emit("alert:updated", alert);

  return NextResponse.json({ alert });
}
