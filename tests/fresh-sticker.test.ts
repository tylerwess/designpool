import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

test("the fresh sticker is a token-colored produce mark on the hero", () => {
  const sticker = readFileSync(join(ROOT, "components/ui/FreshSticker.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const home = readFileSync(join(ROOT, "app/page.tsx"), "utf8");

  assert.match(sticker, /aria-hidden="true"/);
  assert.match(sticker, /FRESH JOBS/);
  assert.match(sticker, /GUARANTEED/);
  assert.match(sticker, /textPath/);
  assert.equal(/#[0-9a-fA-F]{3,8}\b/.test(sticker), false);
  assert.match(home, /FreshSticker/);
  assert.match(css, /\.fresh-sticker\s*\{[^}]*rotate:\s*15deg/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.fresh-sticker/);
  assert.match(css, /\.fresh-sticker-face\s*\{[^}]*fill:\s*var\(--accent\)/);
  assert.match(css, /\.fresh-sticker-back\s*\{[^}]*fill:\s*var\(--on-accent\)/);
});
