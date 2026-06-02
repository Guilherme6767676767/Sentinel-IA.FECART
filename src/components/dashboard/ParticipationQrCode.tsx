"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function ParticipationQrCode() {
  const [url, setUrl] = useState("/alertar");

  useEffect(() => {
    setUrl(`${window.location.origin}/alertar`);
  }, []);

  return (
    <section className="sentinel-panel rounded-lg p-4">
      <p className="font-display text-xs uppercase tracking-[0.18em] text-sentinel-cyan">Participacao publica</p>
      <div className="mt-4 grid place-items-center rounded-md bg-white p-3">
        <QRCodeSVG value={url} size={132} fgColor="#05070d" />
      </div>
      <p className="mt-3 text-center text-sm text-slate-400">Escaneie para enviar um alerta ao vivo.</p>
    </section>
  );
}
