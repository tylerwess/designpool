import assert from "node:assert/strict";
import test from "node:test";

test("the cron route rejects requests while CRON_SECRET is unset", async () => {
  const previousSecret = process.env.CRON_SECRET;
  const previousVercel = process.env.VERCEL;
  const previousDb = process.env.DATABASE_URL;
  delete process.env.CRON_SECRET;
  delete process.env.DATABASE_URL;
  process.env.VERCEL = "1";

  const { GET, POST } = await import("../app/api/cron/route.ts");
  for (const handler of [GET, POST]) {
    const missing = await handler(new Request("https://designpool-taupe.vercel.app/api/cron"));
    assert.equal(missing.status, 401);
    const bearer = await handler(
      new Request("https://designpool-taupe.vercel.app/api/cron", {
        headers: { authorization: "Bearer anything" },
      }),
    );
    assert.equal(bearer.status, 401);
  }

  process.env.CRON_SECRET = "dev-secret";
  const wrong = await GET(
    new Request("https://designpool-taupe.vercel.app/api/cron", {
      headers: { authorization: "Bearer other" },
    }),
  );
  assert.equal(wrong.status, 401);

  const unconfigured = await GET(
    new Request("https://designpool-taupe.vercel.app/api/cron", {
      headers: { authorization: "Bearer dev-secret" },
    }),
  );
  assert.equal(unconfigured.status, 503);
  const body = (await unconfigured.json()) as { error?: string };
  assert.match(body.error ?? "", /DATABASE_URL/);

  if (previousSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = previousSecret;
  if (previousVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = previousVercel;
  if (previousDb === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDb;
});
