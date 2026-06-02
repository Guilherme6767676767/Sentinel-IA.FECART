import { NextResponse } from "next/server";
import { createAlert, listAlerts } from "@/lib/db";
import { alertCategories, schoolLocations } from "@/lib/constants";
import type { CreateAlertInput } from "@/types/alert";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ alerts: await listAlerts() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CreateAlertInput>;

  if (!body.category || !alertCategories.includes(body.category)) {
    return NextResponse.json({ error: "Categoria invalida." }, { status: 400 });
  }

  if (!body.location || !schoolLocations.includes(body.location)) {
    return NextResponse.json({ error: "Local invalido." }, { status: 400 });
  }

  if (!body.description || body.description.trim().length < 8) {
    return NextResponse.json({ error: "Descreva a situacao com pelo menos 8 caracteres." }, { status: 400 });
  }

  const alert = await createAlert({
    category: body.category,
    location: body.location,
    description: body.description.trim()
  });

  global.io?.emit("alert:new", alert);

  return NextResponse.json({ alert }, { status: 201 });
}
