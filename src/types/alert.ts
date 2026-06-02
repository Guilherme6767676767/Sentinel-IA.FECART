export type AlertCategory =
  | "Iluminacao"
  | "Movimentacao suspeita"
  | "Aglomeracao"
  | "Acesso indevido"
  | "Emergencia"
  | "Outros";

export type AlertPriority = "Baixa" | "Media" | "Alta" | "Critica";

export type AlertStatus =
  | "Recebido"
  | "Em analise"
  | "Priorizado"
  | "Equipe acionada"
  | "Resolvido";

export type SchoolLocation =
  | "Entrada"
  | "Patio"
  | "Biblioteca"
  | "Laboratorios"
  | "Quadra"
  | "Corredores";

export type Alert = {
  id: string;
  protocol: string;
  category: AlertCategory;
  location: SchoolLocation;
  description: string;
  priority: AlertPriority;
  urgency: AlertPriority;
  confidence: number;
  status: AlertStatus;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAlertInput = {
  category: AlertCategory;
  location: SchoolLocation;
  description: string;
};

export type AlertClassification = Pick<
  Alert,
  "priority" | "urgency" | "confidence" | "riskScore" | "status"
>;
