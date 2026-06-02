"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import type { Alert } from "@/types/alert";
import { AlertPriorityBadge } from "@/components/alerts/AlertPriorityBadge";

export default function StatusPage() {
  const [protocol, setProtocol] = useState("");
  const [alert, setAlert] = useState<Alert | null>(null);
  const [error, setError] = useState("");

  async function searchStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAlert(null);

    const response = await fetch(`/api/status/${encodeURIComponent(protocol.trim())}`);
    const data = (await response.json()) as { alert?: Alert; error?: string };

    if (!response.ok || !data.alert) {
      setError(data.error || "Protocolo nao encontrado.");
      return;
    }

    setAlert(data.alert);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-xl">
        <Link href="/alertar" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-sentinel-cyan">
          <ArrowLeft className="size-4" />
          Enviar novo alerta
        </Link>
        <section className="sentinel-panel rounded-lg p-5">
          <h1 className="text-2xl font-black">Consultar status</h1>
          <p className="mt-1 text-sm text-slate-400">Digite o protocolo recebido apos o envio.</p>

          <form className="mt-5 flex gap-2" onSubmit={searchStatus}>
            <input
              value={protocol}
              onChange={(event) => setProtocol(event.target.value)}
              placeholder="SIA-260602-0000"
              className="min-w-0 flex-1 rounded-md border border-sentinel-line bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-sentinel-cyan"
            />
            <button className="grid size-12 place-items-center rounded-md bg-sentinel-cyan text-slate-950 shadow-glow">
              <Search className="size-5" />
            </button>
          </form>

          {error ? <p className="mt-4 rounded-md border border-sentinel-red/30 bg-sentinel-red/10 p-3 text-sm text-sentinel-red">{error}</p> : null}

          {alert ? (
            <div className="mt-5 rounded-md border border-sentinel-line bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-sm text-sentinel-cyan">{alert.protocol}</p>
                <AlertPriorityBadge priority={alert.priority} />
              </div>
              <p className="font-bold text-white">{alert.category} em {alert.location}</p>
              <p className="mt-2 text-sm text-slate-400">{alert.description}</p>
              <p className="mt-4 text-sm text-slate-300">
                Status atual: <span className="font-bold text-sentinel-green">{alert.status}</span>
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
