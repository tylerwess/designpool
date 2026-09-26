# Designpool design system

The interface is a calm Claude-like board with a small expressive share. Color and type follow **60/30/10**. Light and dark mode use the same class names. Change the tokens, and the pages follow.

## 60 / 30 / 10

Proportion of a page, not a pile of extra colors.

| Share | Color | Type |
| --- | --- | --- |
| 60% canvas | `bg`, the warm paper or warm near-black | Source Sans 3 for body, navigation, filters, meta, and buttons |
| 30% structure | `surface`, `ink`, `muted`, `line` | Newsreader roman for page titles, section headings, and job titles |
| 10% expressive | `accent` and `accent-soft` | Newsreader italic in the accent color: one headline phrase, the discipline ticker, seniority badges |

The primary button is ink on canvas. It belongs to the structural 30%. Accent is not a fill for large regions.

Both themes keep text contrast at WCAG AA for the accent, ink, and muted pairs.

## What the references contributed

**Claude enterprise** (`claude.com/solutions/enterprise`), without photography: warm paper, an eyebrow, a large serif headline, one primary action, ruled sections, and generous whitespace. No gradients and no heavy shadows.

**Open Doors** (`opendoorscareers.com/jobs`): a jobs list that reads as rows, a “View →” action, filters beside the list, a live count of open roles, and a footer split into Navigate and Sources.

**Designjoy** (`designjoy.co`): an oversized headline, three short value props, and a scrolling strip of disciplines in place of their service marquee. The ink pill is the main action.

## Themes

`app/globals.css` defines a light set and a dark set. Semantic tokens (`--bg`, `--ink`, and the rest) point at one set. `.dark` on `<html>` swaps the pointers.

The first visit follows `prefers-color-scheme`. The header control writes `designpool-theme` (`light` or `dark`) to `localStorage`. `themeInitScript` in `lib/design-tokens.ts` runs before paint, so the page does not flash the wrong theme.

`/design` shows both palettes at once with `.force-light` and `.force-dark`, which set the same pointers on a subtree.

## Where things live

| Piece | Path |
| --- | --- |
| Hex values and theme classes | `app/globals.css` |
| Names, roles, proportions, theme script | `lib/design-tokens.ts` |
| Primitives | `components/ui/` (`Button`, `Badge`, `Surface`, `Eyebrow`, `Field`, `ThemeToggle`, `Container`) |
| Living gallery | `/design` |
| This note | `DESIGN_SYSTEM.md` |

Product pages compose those primitives. They do not introduce new colors.

## How this stays durable

`npm test` includes `tests/design-system.test.ts`, which fails when:

- The 60/30/10 shares no longer add up, or a color token is missing from a role.
- A hex value in `lib/design-tokens.ts` disagrees with `app/globals.css`.
- A file under `app/` or `components/` (other than `globals.css`) uses a raw hex, a default Tailwind palette color, a gradient, or a heavy shadow.
- A listed primitive file is missing, or `DESIGN_SYSTEM.md` and `/design` drop the theme previews.

To change a color, edit the hex in both `lib/design-tokens.ts` and `app/globals.css`, then run `npm test`. To add a component, put it in `components/ui/` and use the semantic tokens.
