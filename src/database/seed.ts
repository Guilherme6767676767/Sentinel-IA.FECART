import { listAlerts } from "@/lib/db";

const alerts = await listAlerts();
console.log(`Banco Sentinel IA pronto com ${alerts.length} alertas.`);
