import type { AlertClassification, CreateAlertInput } from "@/types/alert";

const categoryBaseRisk: Record<CreateAlertInput["category"], number> = {
  Iluminacao: 42,
  "Movimentacao suspeita": 68,
  Aglomeracao: 54,
  "Acesso indevido": 76,
  Emergencia: 92,
  Outros: 38
};

const locationModifier: Record<CreateAlertInput["location"], number> = {
  Entrada: 10,
  Patio: 4,
  Biblioteca: 1,
  Laboratorios: 8,
  Quadra: 7,
  Corredores: 6
};

const criticalTerms = [
  "fogo",
  "briga",
  "arma",
  "ferido",
  "invasao",
  "correndo",
  "grito",
  "emergencia",
  "queda"
];

function priorityFromScore(score: number) {
  if (score >= 86) return "Critica";
  if (score >= 68) return "Alta";
  if (score >= 45) return "Media";
  return "Baixa";
}

export function classifyAlert(input: CreateAlertInput): AlertClassification {
  const normalizedDescription = input.description.toLowerCase();
  const termBoost = criticalTerms.reduce((total, term) => {
    return normalizedDescription.includes(term) ? total + 6 : total;
  }, 0);

  const lengthBoost = input.description.length > 120 ? 5 : input.description.length > 40 ? 2 : 0;
  const rawScore = categoryBaseRisk[input.category] + locationModifier[input.location] + termBoost + lengthBoost;
  const riskScore = Math.max(12, Math.min(98, rawScore));
  const priority = priorityFromScore(riskScore);

  return {
    priority,
    urgency: priority,
    confidence: Math.max(62, Math.min(96, riskScore + 8 - Math.floor(Math.random() * 9))),
    riskScore,
    status: riskScore >= 86 ? "Priorizado" : "Em analise"
  };
}
