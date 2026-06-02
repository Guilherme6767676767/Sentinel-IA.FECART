import { BrainCircuit } from "lucide-react";

export function AiBriefing({ briefing }: { briefing: string }) {
  return (
    <section className="sentinel-panel rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.18em]">
          <BrainCircuit className="size-5 text-sentinel-cyan" />
          Briefing inteligente
        </h2>
        <span className="rounded-full border border-sentinel-green/40 bg-sentinel-green/10 px-3 py-1 text-xs font-bold text-sentinel-green">
          IA ativa
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-300">{briefing}</p>
    </section>
  );
}
