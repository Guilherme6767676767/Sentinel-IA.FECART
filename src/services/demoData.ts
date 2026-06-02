import type { Alert } from "@/types/alert";

export const demoAlerts: Alert[] = [
  {
    id: "demo-1",
    protocol: "SIA-260602-1048",
    category: "Iluminacao",
    location: "Quadra",
    description: "Refletores da quadra falhando perto do portao lateral.",
    priority: "Media",
    urgency: "Media",
    confidence: 82,
    status: "Em analise",
    riskScore: 56,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: "demo-2",
    protocol: "SIA-260602-1182",
    category: "Movimentacao suspeita",
    location: "Entrada",
    description: "Pessoa desconhecida circulando repetidamente proxima a entrada.",
    priority: "Alta",
    urgency: "Alta",
    confidence: 88,
    status: "Priorizado",
    riskScore: 80,
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString()
  },
  {
    id: "demo-3",
    protocol: "SIA-260602-1217",
    category: "Aglomeracao",
    location: "Patio",
    description: "Grupo grande bloqueando passagem no patio durante intervalo.",
    priority: "Media",
    urgency: "Media",
    confidence: 77,
    status: "Recebido",
    riskScore: 58,
    createdAt: new Date(Date.now() - 1000 * 60 * 46).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 46).toISOString()
  },
  {
    id: "demo-4",
    protocol: "SIA-260602-1345",
    category: "Acesso indevido",
    location: "Laboratorios",
    description: "Porta do laboratorio de IA ficou aberta sem responsavel no local.",
    priority: "Alta",
    urgency: "Alta",
    confidence: 86,
    status: "Equipe acionada",
    riskScore: 84,
    createdAt: new Date(Date.now() - 1000 * 60 * 63).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 51).toISOString()
  }
];
