import { databaseMode } from "@/lib/db";
import { runIngest } from "@/lib/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (databaseMode() === "unconfigured") {
    return Response.json(
      { error: "DATABASE_URL is not set. Connect Postgres before running ingest." },
      { status: 503 },
    );
  }
  try {
    const result = await runIngest();
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ingest failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export { handle as GET, handle as POST };
