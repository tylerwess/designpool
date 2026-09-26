import fs from "node:fs";
import path from "node:path";

export type SqlParam = string | number | null;

type Row = Record<string, unknown>;

export interface Db {
  all<T>(sql: string, params?: SqlParam[]): Promise<T[]>;
  run(sql: string, params?: SqlParam[]): Promise<void>;
}

export type DatabaseMode = "postgres" | "sqlite" | "unconfigured";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  company TEXT NOT NULL,
  company_token TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  location TEXT,
  remote_type TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT,
  salary_interval TEXT,
  description TEXT,
  posted_at TEXT,
  source_updated_at TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  seniority TEXT NOT NULL,
  stretch INTEGER NOT NULL DEFAULT 0,
  years_min INTEGER,
  years_max INTEGER,
  industry TEXT NOT NULL,
  size_bucket TEXT NOT NULL,
  disciplines TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS listings_company ON listings (source, company_token);
`;

let dbPromise: Promise<Db> | null = null;

export function databaseMode(): DatabaseMode {
  if (process.env.DATABASE_URL?.trim()) return "postgres";
  if (process.env.VERCEL) return "unconfigured";
  return "sqlite";
}

export function getDb(): Promise<Db> {
  if (databaseMode() === "unconfigured") {
    return Promise.reject(new Error("DATABASE_URL is not set"));
  }
  if (!dbPromise) {
    dbPromise = openDatabase().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

async function openDatabase(): Promise<Db> {
  const mode = databaseMode();
  const db = mode === "postgres" ? await openPostgres() : await openSqlite();
  for (const statement of SCHEMA.split(";").map((part) => part.trim()).filter(Boolean)) {
    await db.run(statement);
  }
  return db;
}

function toPostgres(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

async function openPostgres(): Promise<Db> {
  const postgres = (await import("postgres")).default;
  const url = process.env.DATABASE_URL!.trim();
  const local = /localhost|127\.0\.0\.1/.test(url);
  const sql = postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 20,
    ssl: local || /sslmode=disable/.test(url) ? false : /sslmode=/.test(url) ? undefined : "require",
  });

  return {
    async all<T>(query: string, params: SqlParam[] = []) {
      const rows = await sql.unsafe(toPostgres(query), params as never[]);
      return rows.map((row) => ({ ...row })) as T[];
    },
    async run(query: string, params: SqlParam[] = []) {
      await sql.unsafe(toPostgres(query), params as never[]);
    },
  };
}

async function openSqlite(): Promise<Db> {
  const { DatabaseSync } = await import(/* webpackIgnore: true */ "node:sqlite");
  const file = path.join(process.cwd(), "data", "designpool.sqlite");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new DatabaseSync(file);
  sqlite.exec("PRAGMA journal_mode = WAL;");

  return {
    async all<T>(query: string, params: SqlParam[] = []) {
      const rows = sqlite.prepare(query).all(...(params as Array<string | number | null>)) as Row[];
      return rows.map((row) => ({ ...row })) as T[];
    },
    async run(query: string, params: SqlParam[] = []) {
      sqlite.prepare(query).run(...(params as Array<string | number | null>));
    },
  };
}
