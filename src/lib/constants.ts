import type { AlertCategory, AlertPriority, SchoolLocation } from "@/types/alert";
import type { SchoolMapPoint } from "@/types/map";

export const alertCategories: AlertCategory[] = [
  "Iluminacao",
  "Movimentacao suspeita",
  "Aglomeracao",
  "Acesso indevido",
  "Emergencia",
  "Outros"
];

export const schoolLocations: SchoolLocation[] = [
  "Entrada",
  "Patio",
  "Biblioteca",
  "Laboratorios",
  "Quadra",
  "Corredores"
];

export const schoolMapPoints: SchoolMapPoint[] = [
  { id: "Entrada", label: "Entrada", x: 18, y: 72, zone: "Portaria e acesso principal" },
  { id: "Patio", label: "Patio", x: 45, y: 56, zone: "Convivencia central" },
  { id: "Biblioteca", label: "Biblioteca", x: 28, y: 28, zone: "Bloco academico" },
  { id: "Laboratorios", label: "Laboratorios", x: 68, y: 30, zone: "Tecnico e IA" },
  { id: "Quadra", label: "Quadra", x: 78, y: 70, zone: "Esportes e eventos" },
  { id: "Corredores", label: "Corredores", x: 52, y: 42, zone: "Circulacao interna" }
];

export const priorityColor: Record<AlertPriority, string> = {
  Baixa: "#10b981",
  Media: "#eab308",
  Alta: "#f97316",
  Critica: "#ef4444"
};

export const priorityLabel: Record<AlertPriority, string> = {
  Baixa: "Baixo risco",
  Media: "Atencao",
  Alta: "Moderado",
  Critica: "Critico"
};
