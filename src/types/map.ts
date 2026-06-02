import type { AlertPriority, SchoolLocation } from "./alert";

export type SchoolMapPoint = {
  id: SchoolLocation;
  label: SchoolLocation;
  x: number;
  y: number;
  zone: string;
  priority?: AlertPriority;
};
