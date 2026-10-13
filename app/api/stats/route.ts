import { databaseMode } from "@/lib/db";
import { getIngestHealth } from "@/lib/listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Read-only ingest health for the morning check: aggregate counts and timestamps only. */
export async function GET() {
  if (databaseMode() === "unconfigured") {
    return Response.json({ error: "DATABASE_URL is not set." }, { status: 503 });
  }
  try {
    const health = await getIngestHealth();
    return Response.json(health, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Stats query failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
