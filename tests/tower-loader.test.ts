import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PALETTES } from "../lib/design-tokens";

const ROOT = process.cwd();

test("the tower loader is credited, scoped, and token-colored", () => {
  const source = readFileSync(join(ROOT, "components/ui/TowerLoader.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const home = readFileSync(join(ROOT, "app/page.tsx"), "utf8");

  assert.match(source, /3D tower loader by csozi, www\.csozi\.hu/);
  assert.match(source, /aria-hidden="true"/);
  assert.equal(source.includes("#"), false);
  assert.match(css, /\.tower-loader/);
  assert.match(css, /animation: tower-from-left 4\.6s infinite/);
  assert.match(css, /animation-delay: 1\.15s/);
  assert.match(css, /animation-delay: 2\.3s/);
  assert.match(css, /animation-delay: 3\.45s/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.tower-box/);
  assert.equal(PALETTES.light["tower-left"], "#4a1fcc");
  assert.equal(PALETTES.light["tower-right"], "#5928ed");
  assert.equal(PALETTES.light["tower-top"], "#8a66f5");
  assert.equal(PALETTES.dark["tower-left"], "#4e2ad8");
  assert.equal(PALETTES.dark["tower-right"], "#7a54ff");
  assert.equal(PALETTES.dark["tower-top"], "#b089ff");
  assert.ok(home.indexOf("TowerLoader") < home.indexOf("<h1"), "tower sits above the landing headline");
});
