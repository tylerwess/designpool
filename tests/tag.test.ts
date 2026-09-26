import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PALETTES } from "../lib/design-tokens";

const ROOT = process.cwd();

test("tags use flat token fills with no border or icon", () => {
  const tag = readFileSync(join(ROOT, "components/ui/Tag.tsx"), "utf8");
  const badge = readFileSync(join(ROOT, "components/ui/Badge.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const card = readFileSync(join(ROOT, "components/JobCard.tsx"), "utf8");
  const detail = readFileSync(join(ROOT, "app/jobs/[source]/[token]/[externalId]/page.tsx"), "utf8");

  assert.match(tag, /className="tag"/);
  assert.match(badge, /className="tag"/);
  assert.equal(tag.includes("<svg"), false);
  assert.equal(badge.includes("<svg"), false);
  assert.match(css, /\.tag\s*\{[^}]*border:\s*0/);
  assert.match(css, /\.tag\s*\{[^}]*border-radius:\s*4px/);
  assert.match(css, /\.tag\s*\{[^}]*background:\s*var\(--tag-bg\)/);
  assert.match(css, /\.tag\s*\{[^}]*color:\s*var\(--tag-fg\)/);
  assert.match(css, /\.tag\s*\{[^}]*padding:\s*6px 12px/);
  assert.match(css, /\.tag-row\s*\{[^}]*gap:\s*0\.5rem/);
  assert.match(card, /className="tag-row /);
  assert.match(detail, /className="tag-row /);
  assert.equal(PALETTES.light["tag-bg"], "#f0f0f0");
  assert.equal(PALETTES.light["tag-fg"], "#3d3d3d");
  assert.equal(PALETTES.dark["tag-bg"], "#232323");
  assert.equal(PALETTES.dark["tag-fg"], "#c8c8c8");
});
