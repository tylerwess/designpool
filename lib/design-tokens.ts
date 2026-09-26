/**
 * Design-token contract. Hex values live here and in app/globals.css.
 * tests/design-system.test.ts fails if the two copies drift, or if a
 * component introduces a color outside this set.
 *
 * 60/30/10 is a proportion of the interface, not a count of tokens:
 * canvas is most of every page, structure is text and surfaces, and the
 * accent pair is the small expressive share.
 */

export const PROPORTIONS = {
  canvas: 60,
  structure: 30,
  expressive: 10,
} as const;

export const COLOR_TOKENS = [
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
  "tower-left",
  "tower-right",
  "tower-top",
  "tag-bg",
  "tag-fg",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const COLOR_ROLES: Record<keyof typeof PROPORTIONS, readonly ColorToken[]> = {
  canvas: ["bg"],
  structure: ["surface", "ink", "muted", "line", "tag-bg", "tag-fg"],
  expressive: [
    "accent",
    "accent-hover",
    "accent-active",
    "on-accent",
    "accent-focus",
    "accent-soft",
    "tower-left",
    "tower-right",
    "tower-top",
  ],
};

export const PALETTES: Record<"light" | "dark", Record<ColorToken, string>> = {
  light: {
    bg: "#ffffff",
    surface: "#f3f3f3",
    ink: "#111111",
    muted: "#5c5c5c",
    line: "#e4e4e4",
    accent: "#5928ed",
    "accent-hover": "#4b1fd4",
    "accent-active": "#3f1ab8",
    "on-accent": "#ffffff",
    "accent-focus": "#5928ed",
    "accent-soft": "#efe8ff",
    "tower-left": "#4a1fcc",
    "tower-right": "#5928ed",
    "tower-top": "#8a66f5",
    "tag-bg": "#f0f0f0",
    "tag-fg": "#3d3d3d",
  },
  dark: {
    bg: "#000000",
    surface: "#2c2c2c",
    ink: "#ffffff",
    muted: "#a3a3a3",
    line: "#333333",
    accent: "#7a54ff",
    "accent-hover": "#6b42f5",
    "accent-active": "#5c36e8",
    "on-accent": "#ffffff",
    "accent-focus": "#7a54ff",
    "accent-soft": "#1c1633",
    "tower-left": "#4e2ad8",
    "tower-right": "#7a54ff",
    "tower-top": "#b089ff",
    "tag-bg": "#232323",
    "tag-fg": "#c8c8c8",
  },
};

export const TRACKING = {
  body: "-0.02em",
  meta: "-0.01em",
  display: "-0.02em",
  hero: "-0.035em",
} as const;

export const TYPE_BODY = {
  family: "Work Sans",
  weight: 500,
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
    utility: "font-sans",
    use: "Body copy, navigation, filters, and meta.",
  },
  structure: {
    share: 30,
    family: "Fjalla One",
    utility: "font-display",
    use: "Page titles, section headings, job titles, and buttons.",
  },
  expressive: {
    share: 10,
    family: "Fjalla One at display size",
    utility: "font-display",
    use: "Primary CTAs in the brand accent, plus display-size Fjalla One for the hero and live stats.",
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

/** Theme checkbox halves. The supplied `.theme-checkbox` CSS keeps these hex values literally. */
export const TOGGLE_COLORS = {
  light: "#efefef",
  dark: "#2a2a2a",
} as const;

export const TOGGLE_SIZE = "10px";

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
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
