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
  assert.match(source, /className="loader"/);
  assert.match(source, /className="box box-1"/);
  assert.match(source, /className="side-top"/);
  assert.equal(source.includes("<div"), false, "spans keep the tower valid inside the headline");
  assert.equal(source.includes("#"), false);
  assert.match(css, /\.tower-loader-wrap \.loader/);
  assert.match(css, /scale:\s*2\.25/);
  assert.match(css, /transform-origin:\s*top left/);
  assert.match(css, /--tower-paint-x:/);
  assert.match(css, /animation: from-left 4\.6s infinite/);
  assert.match(css, /animation-delay: 1\.15s/);
  assert.match(css, /animation-delay: 2\.3s/);
  assert.match(css, /animation-delay: 3\.45s/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.tower-loader-wrap \.box/);
  assert.equal(PALETTES.light["tower-left"], "#4a1fcc");
  assert.equal(PALETTES.light["tower-right"], "#5928ed");
  assert.equal(PALETTES.light["tower-top"], "#8a66f5");
  assert.equal(PALETTES.dark["tower-left"], "#4e2ad8");
  assert.equal(PALETTES.dark["tower-right"], "#7a54ff");
  assert.equal(PALETTES.dark["tower-top"], "#b089ff");
  assert.ok(
    home.indexOf("TowerLoader") < home.indexOf("A design job board that"),
    "tower sits above the landing headline",
  );
  assert.match(home, /className="hero-lead"/);
  assert.match(home, /className="hero-title /);
  assert.match(css, /\.hero-title \.tower-loader-wrap\s*\{[^}]*bottom:\s*calc\(100% \+ 0\.125em \+ 1px\)/);
});

test("side-top keeps rotate and skew as separate declarations", () => {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const rotateRule = css.match(/\.tower-loader-wrap \.side-top\s*\{[^}]+\}/);
  const skewRule = css.match(/\.tower-loader-wrap \.box\s*>\s*\.side-top\s*\{[^}]+\}/);
  assert.ok(rotateRule, "scoped .side-top rule exists");
  assert.match(rotateRule[0], /rotate:\s*45deg;/);
  assert.equal(/transform:/i.test(rotateRule[0]), false, "rotate rule must not also set transform");
  assert.ok(skewRule, "separate .side-top transform rule exists");
  assert.match(skewRule[0], /transform:\s*skew\(-20deg,\s*-20deg\);/);
  assert.equal(/rotate:/i.test(skewRule[0]), false, "transform rule must not also set rotate");
  assert.equal(/transform:\s*rotate\(/i.test(css), false);
});
