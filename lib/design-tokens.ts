/**
 * Design-token contract. Hex values live here and in app/globals.css.
 * tests/design-system.test.ts fails if the two copies drift, or if a
 * component introduces a color outside this set.
 *
 * 60/30/10 is a proportion of the interface, not a count of tokens:
 * canvas is most of every page (the page itself, with bg as the slightly
 * lifted fill for cards and controls), structure is text and surfaces, and the
 * accent pair is the small expressive share.
 */

export const PROPORTIONS = {
  canvas: 60,
  structure: 30,
  expressive: 10,
} as const;

export const COLOR_TOKENS = [
  "canvas",
  "bg",
  "surface",
  "ink",
  "muted",
  "line",
  "accent",
  "accent-hover",
  "accent-active",
  "on-accent",
  "accent-focus",
  "accent-soft",
  "brand",
  "brand-soft",
  "brand-ink",
  "tower-left",
  "tower-right",
  "tower-top",
  "tag-bg",
  "tag-fg",
  "positive",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const COLOR_ROLES: Record<keyof typeof PROPORTIONS, readonly ColorToken[]> = {
  canvas: ["canvas", "bg"],
  structure: ["surface", "ink", "muted", "line", "tag-bg", "tag-fg"],
  expressive: [
    "accent",
    "accent-hover",
    "accent-active",
    "on-accent",
    "accent-focus",
    "accent-soft",
    "brand",
    "brand-soft",
    "brand-ink",
    "tower-left",
    "tower-right",
    "tower-top",
    "positive",
  ],
};

export const PALETTES: Record<"light" | "dark", Record<ColorToken, string>> = {
  light: {
    canvas: "#ffffff",
    bg: "#ffffff",
    surface: "#f3f3f3",
    ink: "#111111",
    muted: "#5c5c5c",
    line: "#e4e4e4",
    accent: "#111111",
    "accent-hover": "#333333",
    "accent-active": "#000000",
    "on-accent": "#ffffff",
    "accent-focus": "#111111",
    "accent-soft": "#ebebeb",
    brand: "#111111",
    "brand-soft": "#ebebeb",
    "brand-ink": "#111111",
    "tower-left": "#333333",
    "tower-right": "#5c5c5c",
    "tower-top": "#a3a3a3",
    "tag-bg": "#f0f0f0",
    "tag-fg": "#3d3d3d",
    positive: "#02a969",
  },
  dark: {
    canvas: "#000000",
    bg: "#0d0d0d",
    surface: "#2c2c2c",
    ink: "#ffffff",
    muted: "#a3a3a3",
    line: "#333333",
    accent: "#ffffff",
    "accent-hover": "#e6e6e6",
    "accent-active": "#cccccc",
    "on-accent": "#000000",
    "accent-focus": "#ffffff",
    "accent-soft": "#2c2c2c",
    brand: "#ffffff",
    "brand-soft": "#2c2c2c",
    "brand-ink": "#ffffff",
    "tower-left": "#cccccc",
    "tower-right": "#a3a3a3",
    "tower-top": "#ffffff",
    "tag-bg": "#232323",
    "tag-fg": "#c8c8c8",
    positive: "#02a969",
  },
};

export const TRACKING = {
  body: "-0.03em",
  meta: "-0.02em",
  display: "-0.005em",
  hero: "-0.015em",
} as const;

export const TYPE_BODY = {
  family: "Inter",
  weight: 400,
  size: "1.125rem",
  tracking: TRACKING.body,
  metaTracking: TRACKING.meta,
  lineHeight: 1.6,
  scale: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.375rem",
  },
} as const;

export const TYPE_DISPLAY = {
  family: "Fjalla One",
  weight: 400,
  tracking: TRACKING.display,
  heroTracking: TRACKING.hero,
} as const;

export const TYPE_ROLES = {
  body: {
    share: 60,
    family: TYPE_BODY.family,
    utility: "font-body",
    use: "Body copy, navigation, filters, tags, and meta.",
  },
  structure: {
    share: 30,
    family: "Inter Tight",
    utility: "font-heading",
    use: "Page titles, section headings, and job titles at 600. Buttons stay in Inter 600.",
  },
  expressive: {
    share: 10,
    family: "Fjalla One at display size",
    utility: "font-display",
    use: "Primary CTAs in the white/ink accent, neutral ink icons and data viz, plus display-size Fjalla One for the hero and live stats.",
  },
} as const;

export const UI_PRIMITIVES = [
  "Button",
  "Badge",
  "Tag",
  "Surface",
  "Eyebrow",
  "Field",
  "ThemeToggle",
  "Container",
  "CompanyLogo",
  "TowerLoader",
  "Logo",
] as const;

/** Day/night switch colors. The supplied `.switch` CSS keeps these hex values literally. */
export const DESCRIPTION_PREVIEW = {
  lines: 6,
} as const;

export const SPACE = {
  6: "1.5rem",
  8: "2rem",
} as const;

export const ELEVATION = {
  float: "0 10px 28px rgb(0 0 0 / 0.22)",
} as const;

export const THEME_STORAGE_KEY = "designpool-theme";

/** Runs before paint. An explicit choice wins; otherwise the system preference does. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t!=="light";var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
