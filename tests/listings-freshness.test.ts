import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { THIRTY_DAYS_MS, freshCutoff } from "../lib/listings";

const ROOT = process.cwd();

test("THIRTY_DAYS_MS is exactly 30 days", () => {
  assert.equal(THIRTY_DAYS_MS, 30 * 24 * 60 * 60 * 1000);
});

test("freshCutoff is 30 days before the given instant, as an ISO string", () => {
  const now = Date.parse("2026-06-15T00:00:00.000Z");
  assert.equal(freshCutoff(now), "2026-05-16T00:00:00.000Z");
});

test("ingest reuses the shared 30-day cutoff instead of its own copy", () => {
  const ingest = readFileSync(join(ROOT, "lib/ingest.ts"), "utf8");
  assert.match(ingest, /import\s*\{[^}]*freshCutoff[^}]*\}\s*from\s*"\.\/listings"/);
  assert.match(ingest, /const cutoff = freshCutoff\(\)/);
  assert.equal(/THIRTY_DAYS_MS\s*=\s*30/.test(ingest), false);
});

test("every read path excludes listings older than 30 days, not just the cron delete", () => {
  const listings = readFileSync(join(ROOT, "lib/listings.ts"), "utf8");
  const listListings = listings.slice(listings.indexOf("export async function listListings"));
  const getListing = listings.slice(listings.indexOf("export async function getListing"));
  assert.match(listListings.split("export async function getListing")[0], /COALESCE\(posted_at, first_seen_at\) >= \?/);
  assert.match(getListing.split("export async function upsertListing")[0], /COALESCE\(posted_at, first_seen_at\) >= \?/);
});
