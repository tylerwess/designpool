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

export const COLOR_TOKENS = ["bg", "surface", "ink", "muted", "line", "accent", "accent-soft"] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const COLOR_ROLES: Record<keyof typeof PROPORTIONS, readonly ColorToken[]> = {
  canvas: ["bg"],
  structure: ["surface", "ink", "muted", "line"],
  expressive: ["accent", "accent-soft"],
};

export const PALETTES: Record<"light" | "dark", Record<ColorToken, string>> = {
  light: {
    bg: "#f4f1ea",
    surface: "#fbfaf6",
    ink: "#211e1a",
    muted: "#6e685f",
    line: "#e4ddd2",
    accent: "#9d3f1f",
    "accent-soft": "#f6e6dc",
  },
  dark: {
    bg: "#161412",
    surface: "#221f1c",
    ink: "#f6f1e8",
    muted: "#b3aaa0",
    line: "#3a342e",
    accent: "#f0b090",
    "accent-soft": "#3c2a22",
  },
};

export const TYPE_ROLES = {
  body: {
    share: 60,
    family: "Source Sans 3",
    utility: "font-sans",
    use: "Body copy, navigation, filters, meta, and buttons.",
  },
  structure: {
    share: 30,
    family: "Newsreader",
    utility: "font-serif",
    use: "Page titles, section headings, and job titles.",
  },
  expressive: {
    share: 10,
    family: "Newsreader italic, accent color",
    utility: "font-serif italic text-accent",
    use: "One phrase in a headline, the discipline ticker, and seniority badges.",
  },
} as const;

export const UI_PRIMITIVES = ["Button", "Badge", "Surface", "Eyebrow", "Field", "ThemeToggle", "Container"] as const;

export const THEME_STORAGE_KEY = "designpool-theme";

/** Runs before paint. An explicit choice wins; otherwise the system preference does. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
