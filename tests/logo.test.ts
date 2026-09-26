import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PALETTES, TYPE_DISPLAY } from "../lib/design-tokens";

const ROOT = process.cwd();

test("the wordmark splits Design and pool without hardcoded colors", () => {
  const logo = readFileSync(join(ROOT, "components/ui/Logo.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const header = readFileSync(join(ROOT, "components/Header.tsx"), "utf8");
  const footer = readFileSync(join(ROOT, "components/Footer.tsx"), "utf8");

  assert.match(logo, /className=\{\["logo"/);
  assert.match(logo, /className="logo-pool"/);
  assert.match(logo, /Design\s*<span className="logo-pool">pool<\/span>/);
  assert.equal(logo.includes("#"), false);
  assert.match(css, /\.logo\s*\{/);
  assert.match(css, /letter-spacing:\s*var\(--tracking-hero\)/);
  assert.match(css, /\.logo-pool\s*\{[^}]*background:\s*var\(--accent\)/);
  assert.match(css, /\.logo-pool\s*\{[^}]*color:\s*var\(--on-accent\)/);
  assert.match(header, /<Logo /);
  assert.match(footer, /<Logo /);
  assert.equal(footer.includes('href="/design"'), false);
  assert.equal(TYPE_DISPLAY.heroTracking, "-0.035em");
});

test("the favicon and app icon use the purple pool mark", () => {
  const svg = readFileSync(join(ROOT, "app/icon.svg"), "utf8");
  const icon = readFileSync(join(ROOT, "app/icon.tsx"), "utf8");
  const apple = readFileSync(join(ROOT, "app/apple-icon.tsx"), "utf8");
  const mark = readFileSync(join(ROOT, "lib/brand-mark.tsx"), "utf8");

  assert.match(svg, /prefers-color-scheme:\s*dark/);
  assert.match(svg, new RegExp(PALETTES.light.accent));
  assert.match(svg, new RegExp(PALETTES.dark.accent));
  assert.match(svg, />pool</);
  assert.equal(svg.includes("#f4f1ea"), false);
  assert.match(icon, /ImageResponse/);
  assert.match(icon, /BrandMark/);
  assert.match(apple, /ImageResponse/);
  assert.match(apple, /BrandMark/);
  assert.match(mark, /TYPE_DISPLAY\.heroTracking/);
  assert.match(mark, />pool</);
  assert.equal(existsSync(join(ROOT, "app/favicon.ico")), false);
  assert.equal(existsSync(join(ROOT, "public/favicon.ico")), false);
  assert.equal(existsSync(join(ROOT, "fonts/FjallaOne-Regular.ttf")), true);
});
