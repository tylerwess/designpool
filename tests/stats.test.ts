import assert from "node:assert/strict";
import test from "node:test";

test("the stats route reports a missing database instead of throwing", async () => {
  const previousVercel = process.env.VERCEL;
  const previousDb = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  process.env.VERCEL = "1";

  const { GET } = await import("../app/api/stats/route");
  const response = await GET();
  assert.equal(response.status, 503);

  if (previousVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = previousVercel;
  if (previousDb !== undefined) process.env.DATABASE_URL = previousDb;
});
