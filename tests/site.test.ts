import assert from "node:assert/strict";
import test from "node:test";
import { PRODUCTION_SITE_URL, absoluteUrl, siteUrl } from "../lib/site";

const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

test.after(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
});

test("the canonical site URL defaults to the production domain", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(siteUrl().origin, "https://designpool-taupe.vercel.app");
  assert.equal(absoluteUrl("/jobs"), `${PRODUCTION_SITE_URL}/jobs`);
  assert.equal(absoluteUrl("/"), `${PRODUCTION_SITE_URL}/`);
});

test("NEXT_PUBLIC_SITE_URL overrides the canonical origin", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://jobs.example.com";
  assert.equal(absoluteUrl("/about"), "https://jobs.example.com/about");
  process.env.NEXT_PUBLIC_SITE_URL = "preview.example.com";
  assert.equal(siteUrl().origin, "https://preview.example.com");
});

test("a bad site URL falls back to production", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "http://";
  assert.equal(siteUrl().origin, "https://designpool-taupe.vercel.app");
});

test("sitemap uses the canonical origin when the database is not configured", async () => {
  const previousDb = process.env.DATABASE_URL;
  const previousVercel = process.env.VERCEL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.DATABASE_URL;
  process.env.VERCEL = "1";
  const { default: sitemap } = await import("../app/sitemap");
  const urls = (await sitemap()).map((entry) => entry.url);
  assert.deepEqual(urls, [
    `${PRODUCTION_SITE_URL}/`,
    `${PRODUCTION_SITE_URL}/jobs`,
    `${PRODUCTION_SITE_URL}/about`,
    `${PRODUCTION_SITE_URL}/design`,
  ]);
  if (previousDb === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDb;
  if (previousVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = previousVercel;
});
