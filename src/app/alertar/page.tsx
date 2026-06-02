import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AlertForm } from "@/components/alerts/AlertForm";

export default function AlertarPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-xl">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-sentinel-cyan">
          <ArrowLeft className="size-4" />
          Voltar para central
        </Link>
        <AlertForm />
        <p className="mt-4 text-center text-xs text-slate-500">
          Sentinel IA nao monitora cameras. A plataforma organiza relatos enviados pela comunidade.
        </p>
      </div>
    </main>
  );
}
