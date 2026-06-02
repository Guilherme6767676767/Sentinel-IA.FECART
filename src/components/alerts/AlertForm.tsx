"use client";

import { useState } from "react";
import { Send, ShieldAlert } from "lucide-react";
import { alertCategories, schoolLocations } from "@/lib/constants";
import type { Alert, AlertCategory, SchoolLocation } from "@/types/alert";
import { AlertPriorityBadge } from "./AlertPriorityBadge";

export function AlertForm() {
  const [category, setCategory] = useState<AlertCategory>("Iluminacao");
  const [location, setLocation] = useState<SchoolLocation>("Entrada");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAlert, setCreatedAlert] = useState<Alert | null>(null);
  const [error, setError] = useState("");

  async function submitAlert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, location, description })
    });

    const data = (await response.json()) as { alert?: Alert; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !data.alert) {
      setError(data.error || "Nao foi possivel enviar o alerta.");
      return;
    }

    setCreatedAlert(data.alert);
    setDescription("");
  }

  return (
    <div className="sentinel-panel rounded-lg p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-sentinel-cyan/10 text-sentinel-cyan shadow-glow">
          <ShieldAlert className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-black">Enviar alerta</h1>
          <p className="text-sm text-slate-400">Seu relato aparece no painel da equipe em tempo real.</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={submitAlert}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-300">Tipo de ocorrencia</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as AlertCategory)}
            className="w-full rounded-md border border-sentinel-line bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-sentinel-cyan"
          >
            {alertCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-300">Local</span>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value as SchoolLocation)}
            className="w-full rounded-md border border-sentinel-line bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-sentinel-cyan"
          >
            {schoolLocations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-300">Descricao</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={8}
            rows={5}
            placeholder="Descreva o que aconteceu, sem expor dados pessoais."
            className="w-full resize-none rounded-md border border-sentinel-line bg-slate-950/70 px-3 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sentinel-cyan"
          />
        </label>

        {error ? <p className="rounded-md border border-sentinel-red/30 bg-sentinel-red/10 p-3 text-sm text-sentinel-red">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-sentinel-cyan px-4 py-3 font-black text-slate-950 shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-4" />
          {isSubmitting ? "Enviando..." : "Enviar para Sentinel IA"}
        </button>
      </form>

      {createdAlert ? (
        <div className="mt-5 rounded-md border border-sentinel-green/30 bg-sentinel-green/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-sentinel-green">Alerta recebido</p>
            <AlertPriorityBadge priority={createdAlert.priority} />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Protocolo: <span className="font-display text-sentinel-cyan">{createdAlert.protocol}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Status inicial: {createdAlert.status}. Confianca da analise: {createdAlert.confidence}%.
          </p>
        </div>
      ) : null}
    </div>
  );
}
