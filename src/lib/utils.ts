import type { AlertPriority } from "@/types/alert";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function priorityWeight(priority: AlertPriority) {
  return {
    Baixa: 1,
    Media: 2,
    Alta: 3,
    Critica: 4
  }[priority];
}

export function makeProtocol() {
  const day = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SIA-${day}-${random}`;
}
