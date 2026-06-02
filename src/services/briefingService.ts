import type { Alert } from "@/types/alert";
import { priorityWeight } from "@/lib/utils";

export function generateBriefing(alerts: Alert[]) {
  if (alerts.length === 0) {
    return "Nenhum alerta comunitario ativo no momento. Sentinel IA mantem observacao preventiva nos pontos de maior circulacao.";
  }

  const sorted = [...alerts].sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
  const top = sorted[0];
  const locationCount = alerts.reduce<Record<string, number>>((acc, alert) => {
    acc[alert.location] = (acc[alert.location] || 0) + 1;
    return acc;
  }, {});
  const hotLocation = Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0];
  const highPriority = alerts.filter((alert) => ["Alta", "Critica"].includes(alert.priority)).length;

  return `Foram registrados ${alerts.length} alertas recentes. A regiao com maior concentracao e ${hotLocation[0]}, com ${hotLocation[1]} relato(s). O alerta mais sensivel envolve ${top.category.toLowerCase()} em ${top.location}, com prioridade ${top.priority.toLowerCase()} e confianca de ${top.confidence}%. Recomenda-se triagem rapida e retorno publico apos verificacao da equipe. ${highPriority > 1 ? "Ha multiplos sinais de prioridade alta, exigindo acompanhamento continuo." : ""}`;
}
