import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import initSqlJs, { type Database } from "sql.js";
import type { Alert, CreateAlertInput } from "@/types/alert";
import { classifyAlert } from "@/services/aiClassifierService";
import { demoAlerts } from "@/services/demoData";
import { makeProtocol } from "@/lib/utils";

const databaseDir = path.join(process.cwd(), "src", "database");
const databasePath = path.join(databaseDir, "sentinel.db");
const schemaPath = path.join(databaseDir, "schema.sql");
const sqlJsDistDir = path.join(process.cwd(), "node_modules", "sql.js", "dist");

let dbInstance: Database | null = null;

async function getDb() {
  if (!existsSync(databaseDir)) {
    mkdirSync(databaseDir, { recursive: true });
  }

  if (!dbInstance) {
    const SQL = await initSqlJs({
      locateFile: (file) => path.join(sqlJsDistDir, file)
    });

    dbInstance = existsSync(databasePath)
      ? new SQL.Database(readFileSync(databasePath))
      : new SQL.Database();

    dbInstance.run(readFileSync(schemaPath, "utf-8"));
    seedIfEmpty(dbInstance);
    persist(dbInstance);
  }

  return dbInstance;
}

function persist(db: Database) {
  writeFileSync(databasePath, Buffer.from(db.export()));
}

function rowsToAlerts(db: Database, sql: string, params: unknown[] = []) {
  const result = db.exec(sql, params);
  if (!result[0]) return [];

  const { columns, values } = result[0];
  return values.map((row) => {
    return columns.reduce<Record<string, unknown>>((alert, column, index) => {
      alert[column] = row[index];
      return alert;
    }, {}) as Alert;
  });
}

function seedIfEmpty(db: Database) {
  const count = db.exec("SELECT COUNT(*) as count FROM alerts")[0]?.values[0]?.[0] as number | undefined;
  if (count && count > 0) return;

  demoAlerts.forEach((alert) => insertAlert(db, alert));
}

function insertAlert(db: Database, alert: Alert) {
  db.run(
    `INSERT INTO alerts (
      id, protocol, category, location, description, priority, urgency,
      confidence, status, riskScore, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      alert.id,
      alert.protocol,
      alert.category,
      alert.location,
      alert.description,
      alert.priority,
      alert.urgency,
      alert.confidence,
      alert.status,
      alert.riskScore,
      alert.createdAt,
      alert.updatedAt
    ]
  );
}

export async function listAlerts() {
  const db = await getDb();
  return rowsToAlerts(db, "SELECT * FROM alerts ORDER BY datetime(createdAt) DESC LIMIT 80");
}

export async function getAlertByProtocol(protocol: string) {
  const db = await getDb();
  return rowsToAlerts(db, "SELECT * FROM alerts WHERE protocol = ? LIMIT 1", [protocol])[0];
}

export async function createAlert(input: CreateAlertInput) {
  const db = await getDb();
  const now = new Date().toISOString();
  const classification = classifyAlert(input);
  const alert: Alert = {
    id: crypto.randomUUID(),
    protocol: makeProtocol(),
    ...input,
    ...classification,
    createdAt: now,
    updatedAt: now
  };

  insertAlert(db, alert);
  persist(db);

  return alert;
}

export async function updateAlertStatus(id: string, status: Alert["status"]) {
  const db = await getDb();
  const updatedAt = new Date().toISOString();
  db.run("UPDATE alerts SET status = ?, updatedAt = ? WHERE id = ?", [status, updatedAt, id]);
  persist(db);

  return rowsToAlerts(db, "SELECT * FROM alerts WHERE id = ? LIMIT 1", [id])[0];
}
