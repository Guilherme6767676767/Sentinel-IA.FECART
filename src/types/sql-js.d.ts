declare module "sql.js" {
  export type SqlValue = string | number | Uint8Array | null;

  export type QueryExecResult = {
    columns: string[];
    values: SqlValue[][];
  };

  export class Database {
    constructor(data?: Buffer | Uint8Array);
    run(sql: string, params?: unknown[]): Database;
    exec(sql: string, params?: unknown[]): QueryExecResult[];
    export(): Uint8Array;
  }

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<{
    Database: typeof Database;
  }>;
}
