import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

test("the landing page uses a source logo reel instead of live counts", () => {
  const home = readFileSync(join(ROOT, "app/page.tsx"), "utf8");
  const live = readFileSync(join(ROOT, "components/LandingLive.tsx"), "utf8");
  const reel = readFileSync(join(ROOT, "components/SourceLogoReel.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");

  assert.match(home, /SourceLogoReel/);
  assert.match(reel, /Listings curated from Ashby, Greenhouse, and Lever/);
  assert.match(reel, /className="source-reel /);
  assert.match(css, /\.source-reel\s*\{/);
  assert.match(css, /animation:\s*source-reel 48s linear infinite/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.source-reel-track/);
  assert.equal(live.includes("Odometer"), false);
  assert.equal(live.includes("open roles"), false);
  assert.equal(existsSync(join(ROOT, "components/Odometer.tsx")), false);
  assert.equal(css.includes("ticker-track"), false);
});

test("the landing page is left-aligned to the header content column", () => {
  const home = readFileSync(join(ROOT, "app/page.tsx"), "utf8");
  const live = readFileSync(join(ROOT, "components/LandingLive.tsx"), "utf8");
  const reel = readFileSync(join(ROOT, "components/SourceLogoReel.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const doc = readFileSync(join(ROOT, "DESIGN_SYSTEM.md"), "utf8");

  assert.equal(/text-center/.test(home), false);
  assert.equal(/justify-center/.test(home), false);
  assert.equal(/justify-center/.test(live), false);
  assert.equal(home.includes("mx-auto"), false);
  assert.equal(live.includes("mx-auto"), false);
  assert.equal(reel.includes("text-center"), false);
  assert.match(css, /\.tower-loader-wrap\s*\{[^}]*margin:\s*0 0 0\.875rem/);
  assert.match(doc, /left-aligned/);
});
