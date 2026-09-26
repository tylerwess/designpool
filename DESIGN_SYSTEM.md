# Designpool design system

The interface follows the restraint of OpenAI’s product pages: a flat canvas, large centered headlines, thin 1px borders, pill controls, and generous space. Color and type still follow **60/30/10**. Light and dark mode use the same class names.

## 60 / 30 / 10

| Share | Color | Type |
| --- | --- | --- |
| 60% canvas | `bg`. White in light mode, black in dark mode. | Lato for body, navigation, filters, and meta |
| 30% structure | `surface` (the gray band), `ink`, `muted`, `line` | Fjalla One for page titles, section headings, job titles, and buttons |
| 10% expressive | `accent`, `accent-hover`, `accent-active`, `on-accent`, `accent-focus`, and `accent-soft`. Light base is `#5928ed`. Dark base is `#7a54ff`. | Fjalla One at display size: the hero and live stat numbers |

The brand violet is only on primary CTAs (Apply, Search, Browse, and other default buttons). Secondary and ghost stay ink. Cards sit on the canvas with a 1px border. `surface` is the slightly lighter or darker band under a single statement, not a stack of value-prop columns.

Text contrast stays at WCAG AA for ink and muted on both canvases, and for `on-accent` on `accent`, `accent-hover`, and `accent-active`.

## References

OpenAI’s product and security pages (`openai.com`): black canvas, centered display type, thin-bordered cards, a rounded pill of choices, a row of large numbers with small captions, and a gray section band. Light mode uses the same structure on white.

Job rows use two actions: Read more opens the role, and Apply launches the company posting. Each row and the role header show a squircle logo tile to the left of the company name (`CompanyLogo`). The tile is always the light canvas so brand marks stay visible in dark mode. If the mark is missing, the company’s first letter sits on that same tile. Search is a title-or-company field. Filters are chips that open dropdowns, including location. Buttons use Fjalla One at the same weight and letter-spacing as headings, with 1.5rem of left and right padding. Controls use a fixed height and equal inline padding, with no native select chrome. There is no scrolling marquee.

## Themes

`app/globals.css` defines a light set and a dark set. Semantic tokens point at one set. `.dark` on `<html>` swaps the pointers.

The first visit follows `prefers-color-scheme`. The header control writes `designpool-theme` (`light` or `dark`) to `localStorage`. `themeInitScript` runs before paint.

`/design` shows both palettes at once with `.force-light` and `.force-dark`.

## Where things live

| Piece | Path |
| --- | --- |
| Hex values and theme classes | `app/globals.css` |
| Names, roles, proportions, theme script | `lib/design-tokens.ts` |
| Primitives | `components/ui/` (`Button`, `Badge`, `Surface`, `Eyebrow`, `Field`, `ThemeToggle`, `Container`, `CompanyLogo`) |
| Living gallery | `/design` |
| This note | `DESIGN_SYSTEM.md` |

Headings load Fjalla One and body text loads Lato through `next/font/google` in `app/layout.tsx`. Headings use a slight negative letter-spacing (`-0.02em`, and `-0.035em` on `h1`) so large Fjalla One lines sit tighter without crowding.

## How this stays durable

`npm test` includes `tests/design-system.test.ts`, which fails when:

- The 60/30/10 shares no longer add up, or a color token is missing from a role.
- A hex value in `lib/design-tokens.ts` disagrees with `app/globals.css`.
- A file under `app/` or `components/` (other than `globals.css`) uses a raw hex, a default Tailwind palette color, a gradient, or a heavy shadow.
- A listed primitive file is missing, or `DESIGN_SYSTEM.md` and `/design` drop the theme previews.
- The type roles are no longer Fjalla One and Lato, or the ticker returns.

To change a color, edit the hex in both `lib/design-tokens.ts` and `app/globals.css`, then run `npm test`.
