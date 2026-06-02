CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  protocol TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  urgency TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  status TEXT NOT NULL,
  riskScore INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_location ON alerts(location);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority);
