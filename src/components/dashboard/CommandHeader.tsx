import { Activity, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CommandHeader({ alertCount, riskLevel }: { alertCount: number; riskLevel: string }) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-sentinel-line bg-black/30 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sentinel-green opacity-70" />
          <span className="relative inline-flex size-3 rounded-full bg-sentinel-green" />
        </span>
        <ShieldCheck className="size-8 text-sentinel-cyan drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
        <div>
          <h1 className="font-display text-xl font-black tracking-[0.18em] text-white">
            SENTINEL <span className="text-sentinel-cyan text-glow">IA</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Inteligencia comunitaria escolar
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Risco geral</p>
          <p className="font-display text-sm text-sentinel-orange">{riskLevel}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Alertas ativos</p>
          <p className="font-display text-sm text-sentinel-red">{alertCount}</p>
        </div>
        <div className="flex items-center gap-2 text-sentinel-green">
          <Activity className="size-4" />
          <span className="font-display text-xs uppercase tracking-[0.18em]">Ao vivo</span>
        </div>
      </div>

      <Link
        href="/alertar"
        className="inline-flex items-center gap-2 rounded-md border border-sentinel-cyan/40 bg-sentinel-cyan/10 px-4 py-2 text-sm font-bold text-sentinel-cyan shadow-glow transition hover:bg-sentinel-cyan/20"
      >
        <QrCode className="size-4" />
        Participar
      </Link>
    </header>
  );
}
