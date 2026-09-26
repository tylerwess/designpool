import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  SOURCE_LOGOS,
  SOURCE_REEL_CAPTION,
  SOURCE_REEL_DURATION_S,
  SOURCE_REEL_LOGO_HEIGHT_PX,
  SOURCE_REEL_REPEAT,
} from "../lib/source-logos";

const ROOT = process.cwd();

test("the landing page uses a source logo reel instead of live counts", () => {
  const home = readFileSync(join(ROOT, "app/page.tsx"), "utf8");
  const live = readFileSync(join(ROOT, "components/LandingLive.tsx"), "utf8");
  const reel = readFileSync(join(ROOT, "components/SourceLogoReel.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");

  assert.match(home, /SourceLogoReel/);
  assert.match(reel, /SOURCE_REEL_CAPTION/);
  assert.equal(SOURCE_REEL_CAPTION, "Listings curated from Ashby, Greenhouse, and Lever.");
  assert.match(reel, /className="source-reel"/);
  assert.match(css, /\.source-reel\s*\{/);
  assert.match(css, new RegExp(`animation:\\s*source-reel ${SOURCE_REEL_DURATION_S}s linear infinite`));
  assert.equal(SOURCE_REEL_DURATION_S, 192);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.source-reel-track/);
  assert.equal(live.includes("Odometer"), false);
  assert.equal(live.includes("open roles"), false);
  assert.equal(existsSync(join(ROOT, "components/Odometer.tsx")), false);
  assert.equal(css.includes("ticker-track"), false);
});

test("the source reel shows only Greenhouse, Ashby, and Lever local marks", () => {
  const reel = readFileSync(join(ROOT, "components/SourceLogoReel.tsx"), "utf8");
  assert.deepEqual(
    SOURCE_LOGOS.map((logo) => logo.name),
    ["Greenhouse", "Ashby", "Lever"],
  );
  assert.equal(SOURCE_REEL_REPEAT >= 6, true);
  assert.equal(SOURCE_REEL_LOGO_HEIGHT_PX, 35);
  assert.match(cssHeight(), /height:\s*2\.1875rem/);
  assert.match(reel, /SOURCE_LOGOS/);
  assert.equal(reel.includes("CompanyLogo"), false);
  assert.equal(reel.includes("reelCompanies"), false);
  for (const logo of SOURCE_LOGOS) {
    assert.match(logo.src, /^\/logos\//);
    assert.equal(existsSync(join(ROOT, "public", logo.src.replace(/^\//, ""))), true, `${logo.src} missing`);
  }
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
  assert.match(css, /\.tower-loader-wrap\s*\{[^}]*margin:\s*0;/);
  assert.match(doc, /left-aligned/);
});

test("seniority tabs hug their items and only ring on :focus-visible", () => {
  const live = readFileSync(join(ROOT, "components/LandingLive.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  assert.match(live, /className="landing-seniority"/);
  assert.match(css, /\.landing-seniority\s*\{[^}]*display:\s*inline-flex/);
  assert.match(css, /\.landing-seniority\s*\{[^}]*width:\s*fit-content/);
  assert.match(css, /\.landing-seniority\s*\{[^}]*padding:\s*0\.25rem/);
  assert.match(css, /\.landing-seniority\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(css, /\.landing-seniority-tab:focus\s*\{[^}]*outline:\s*none/);
  assert.match(css, /\.landing-seniority-tab:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--accent-focus\)/);
});

function cssHeight(): string {
  return readFileSync(join(ROOT, "app/globals.css"), "utf8");
}
