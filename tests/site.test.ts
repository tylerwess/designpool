import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PRODUCTION_SITE_URL, absoluteUrl, shouldHideDesignGallery, siteUrl } from "../lib/site";

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
  ]);
  assert.equal(urls.includes(`${PRODUCTION_SITE_URL}/design`), false);
  if (previousDb === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDb;
  if (previousVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = previousVercel;
});

test("the design gallery is hidden in production and on Vercel", () => {
  assert.equal(shouldHideDesignGallery({ NODE_ENV: "development" }), false);
  assert.equal(shouldHideDesignGallery({ NODE_ENV: "test" }), false);
  assert.equal(shouldHideDesignGallery({ NODE_ENV: "production" }), true);
  assert.equal(shouldHideDesignGallery({ NODE_ENV: "development", VERCEL_ENV: "preview" }), true);
  assert.equal(shouldHideDesignGallery({ NODE_ENV: "development", VERCEL_ENV: "production" }), true);
  assert.equal(shouldHideDesignGallery({ VERCEL_ENV: "development" }), true);
});

test("the hero headline and subtext say free in the brand accent", () => {
  const home = readFileSync(join(process.cwd(), "app/page.tsx"), "utf8");
  assert.match(home, /A design job board that\{" "\}/);
  assert.match(home, /<span className="underline decoration-accent decoration-4 underline-offset-8">makes sense\.<\/span>/);
  assert.match(home, /Smart filters, fresh listings, always <span className="text-accent">free<\/span>\./);
});

test("the Open Graph image is a static screenshot, not a generated card", () => {
  assert.equal(existsSync(join(process.cwd(), "app/opengraph-image.png")), true);
  assert.equal(existsSync(join(process.cwd(), "app/opengraph-image.tsx")), false);
});

test("the about page credits Tyler Wesson and links his site", () => {
  const about = readFileSync(join(process.cwd(), "app/about/page.tsx"), "utf8");
  assert.match(about, /Tyler/);
  assert.match(about, /https:\/\/www\.tylerwdesign\.site\//);
  assert.match(about, /target="_blank"/);
  assert.match(about, /rel="noopener noreferrer"/);
});

test("robots disallows /design", async () => {
  const { default: robots } = await import("../app/robots");
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
  assert.deepEqual(rules?.disallow, ["/design"]);
});
