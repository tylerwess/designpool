import { databaseMode } from "@/lib/db";
import { runIngest } from "@/lib/ingest";
import { companiesForIngest, companiesForPart, parseIngestPart } from "@/lib/ingest-sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  const slice = parseIngestPart(new URL(request.url).searchParams);
  if (typeof slice === "string") {
    return Response.json({ error: slice }, { status: 400 });
  }
  try {
    const all = companiesForIngest();
    const result = await runIngest(slice ? companiesForPart(all, slice) : all);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ingest failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export { handle as GET, handle as POST };
