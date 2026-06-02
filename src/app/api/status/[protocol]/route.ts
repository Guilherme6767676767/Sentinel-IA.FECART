import { NextResponse } from "next/server";
import { getAlertByProtocol } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { protocol: string } }) {
  const alert = await getAlertByProtocol(params.protocol);

  if (!alert) {
    return NextResponse.json({ error: "Protocolo nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ alert });
}
