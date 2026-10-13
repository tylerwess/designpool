import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  COLOR_ROLES,
  COLOR_TOKENS,
  DESCRIPTION_PREVIEW,
  ELEVATION,
  SPACE,
  PALETTES,
  PROPORTIONS,
  THEME_STORAGE_KEY,
  TOGGLE_COLORS,
  TOGGLE_SIZE,
  TRACKING,
  TYPE_BODY,
  TYPE_DISPLAY,
  TYPE_ROLES,
  UI_PRIMITIVES,
  themeInitScript,
} from "../lib/design-tokens";

const ROOT = process.cwd();

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (/\.(tsx|ts|css)$/.test(entry)) files.push(path);
  }
  return files;
}

test("60/30/10 proportions and token roles stay complete", () => {
  assert.equal(PROPORTIONS.canvas + PROPORTIONS.structure + PROPORTIONS.expressive, 100);
  assert.equal(TYPE_ROLES.body.share + TYPE_ROLES.structure.share + TYPE_ROLES.expressive.share, 100);
  const assigned = [...COLOR_ROLES.canvas, ...COLOR_ROLES.structure, ...COLOR_ROLES.expressive];
  assert.deepEqual([...assigned].sort(), [...COLOR_TOKENS].sort());
  assert.equal(new Set(assigned).size, assigned.length);
});

test("CSS palettes match the token contract", () => {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  for (const theme of ["light", "dark"] as const) {
    for (const token of COLOR_TOKENS) {
      assert.match(css, new RegExp(`--${theme}-${token}: ${PALETTES[theme][token]};`));
    }
  }
  assert.match(css, /\.dark\s*\{[^}]*--bg:\s*var\(--dark-bg\)/);
  assert.match(css, /\.force-light\s*\{/);
  assert.match(css, /\.force-dark\s*\{/);
});

test("theme init stores an explicit choice and falls back to the system", () => {
  assert.match(themeInitScript, new RegExp(THEME_STORAGE_KEY));
  assert.match(themeInitScript, /prefers-color-scheme: dark/);
  assert.match(themeInitScript, /classList\.toggle\("dark"/);
});

test("UI primitives exist and product views do not invent colors", () => {
  for (const name of UI_PRIMITIVES) {
    const source = readFileSync(join(ROOT, "components/ui", `${name}.tsx`), "utf8");
    assert.equal(source.includes("#"), false, `${name} should use semantic tokens`);
  }

  const bannedPalette =
    /(?:bg|text|border|from|to|via|fill|stroke|ring|outline|decoration|divide|placeholder|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/;
  const files = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components"))].filter(
    (path) => !path.endsWith(`${join("app", "globals.css")}`),
  );

  for (const path of files) {
    const source = readFileSync(path, "utf8");
    assert.equal(/#[0-9a-fA-F]{3,8}\b/.test(source), false, `${path} has a raw hex color`);
    assert.equal(bannedPalette.test(source), false, `${path} uses a Tailwind palette color`);
    assert.equal(/bg-gradient|shadow-(?:sm|md|lg|xl|2xl)/.test(source), false, `${path} adds a gradient or heavy shadow`);
  }
});

function channel(hex: string, index: number): number {
  return parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
}

function luminance(hex: string): number {
  const rgb = [0, 1, 2].map((index) => {
    const value = channel(hex, index);
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((left, right) => right - left);
  return (hi + 0.05) / (lo + 0.05);
}

test("primary accent text meets WCAG AA in both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    const on = PALETTES[theme]["on-accent"];
    for (const token of ["accent", "accent-hover", "accent-active"] as const) {
      const ratio = contrastRatio(on, PALETTES[theme][token]);
      assert.ok(ratio >= 4.5, `${theme} ${token} on ${on} is ${ratio.toFixed(2)}:1`);
    }
    const accentOnBg = contrastRatio(PALETTES[theme].accent, PALETTES[theme].bg);
    assert.ok(accentOnBg >= 3, `${theme} accent on bg is ${accentOnBg.toFixed(2)}:1`);
  }
  assert.equal(PALETTES.light.accent, "#0073e6");
  assert.equal(PALETTES.light["on-accent"], "#ffffff");
});

test("the written system and the gallery route exist", () => {
  const doc = readFileSync(join(ROOT, "DESIGN_SYSTEM.md"), "utf8");
  for (const phrase of ["60/30/10", "/design", "Fjalla One", "Work Sans", "OpenAI", "1.125rem", "-0.02em", "-0.01em"]) {
    assert.equal(doc.includes(phrase), true, `DESIGN_SYSTEM.md should mention ${phrase}`);
  }
  assert.equal(TYPE_ROLES.body.family, "Work Sans");
  assert.equal(TYPE_ROLES.structure.family, "Fjalla One");
  assert.equal(TYPE_BODY.family, "Work Sans");
  assert.equal(TYPE_BODY.weight, 500);
  assert.equal(TYPE_BODY.size, "1.125rem");
  assert.equal(TYPE_BODY.tracking, TRACKING.body);
  assert.equal(TYPE_BODY.tracking, "-0.02em");
  assert.equal(TYPE_BODY.metaTracking, "-0.01em");
  assert.equal(TYPE_DISPLAY.family, "Fjalla One");
  assert.equal(TYPE_DISPLAY.heroTracking, "-0.035em");
  const page = readFileSync(join(ROOT, "app/design/page.tsx"), "utf8");
  assert.match(page, /force-light/);
  assert.match(page, /force-dark/);
  assert.match(page, /<Tag /);
  assert.match(page, /ThemeToggle/);
  assert.match(page, /Apply now/);
  assert.match(page, /TowerLoader/);
  assert.match(page, /SourceLogoReel/);
  assert.match(page, /FreshSticker/);
  assert.match(page, /<Logo /);
  assert.match(page, /shouldHideDesignGallery/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.equal(existsSync(join(ROOT, "components/Ticker.tsx")), false);
  assert.equal(readFileSync(join(ROOT, "app/globals.css"), "utf8").includes("ticker-track"), false);
});

test("the theme switch and floating apply tokens stay documented", () => {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const doc = readFileSync(join(ROOT, "DESIGN_SYSTEM.md"), "utf8");
  const toggle = readFileSync(join(ROOT, "components/ui/ThemeToggle.tsx"), "utf8");

  assert.equal(TOGGLE_COLORS.night, "#2a2a2a");
  assert.equal(TOGGLE_COLORS.day, "#00a6ff");
  assert.equal(TOGGLE_COLORS.moon, "#fff");
  assert.equal(TOGGLE_COLORS.sun, "#ffcf48");
  assert.equal(TOGGLE_SIZE, "13px");
  assert.equal(DESCRIPTION_PREVIEW.lines, 6);
  assert.equal(SPACE[6], "1.5rem");
  assert.equal(SPACE[8], "2rem");
  assert.match(css, /--space-6:\s*1\.5rem/);
  assert.match(css, /--space-8:\s*2rem/);
  assert.match(css, new RegExp(`--toggle-size:\\s*${TOGGLE_SIZE}`));
  assert.match(css, new RegExp(TOGGLE_COLORS.night));
  assert.match(css, new RegExp(TOGGLE_COLORS.day));
  assert.match(css, /\.switch\s*\{/);
  assert.match(css, /\.slider\s*\{/);
  assert.match(css, /\.star\s*\{/);
  assert.match(css, /\.cloud\s*\{/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.slider/);
  assert.match(css, new RegExp(`--shadow-float:\\s*${ELEVATION.float.replace(/[()]/g, "\\$&")}`));
  assert.match(toggle, /className="switch"/);
  assert.match(toggle, /aria-label="Light mode"/);
  assert.equal(toggle.includes("#"), false);
  for (const phrase of ["switch", "Apply now", "toggle-day", "13px"]) {
    assert.equal(doc.includes(phrase), true, `DESIGN_SYSTEM.md should mention ${phrase}`);
  }
});

test("body type tokens drive CSS and next/font", () => {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  assert.match(css, /font-family:\s*var\(--font-sans\),\s*"Work Sans"/);
  assert.match(css, new RegExp(`font-weight:\\s*${TYPE_BODY.weight}`));
  assert.match(css, new RegExp(`font-size:\\s*${TYPE_BODY.size}`));
  assert.match(css, new RegExp(`--tracking-body:\\s*${TYPE_BODY.tracking.replace(".", "\\.")}`));
  assert.match(css, new RegExp(`--tracking-meta:\\s*${TYPE_BODY.metaTracking.replace(".", "\\.")}`));
  assert.match(css, new RegExp(`--tracking-display:\\s*${TYPE_DISPLAY.tracking.replace(".", "\\.")}`));
  assert.match(css, new RegExp(`--tracking-hero:\\s*${TYPE_DISPLAY.heroTracking.replace(".", "\\.")}`));
  assert.match(css, /letter-spacing:\s*var\(--tracking-body\)/);
  assert.match(css, /letter-spacing:\s*var\(--tracking-meta\)/);
  assert.match(css, /letter-spacing:\s*var\(--tracking-hero\)/);
  assert.match(css, new RegExp(`line-height:\\s*${TYPE_BODY.lineHeight}`));
  for (const [step, size] of Object.entries(TYPE_BODY.scale)) {
    assert.match(css, new RegExp(`--text-${step}:\\s*${size.replace(".", "\\.")}`));
  }
  const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");
  assert.match(layout, /Work_Sans/);
  assert.equal(layout.includes("Lato"), false);
  assert.match(layout, /Fjalla_One/);
});
