# Designpool design system

The interface follows the restraint of OpenAI’s product pages: a flat canvas, large centered headlines, thin 1px borders, pill controls, and generous space. Color and type still follow **60/30/10**. Light and dark mode use the same class names.

## 60 / 30 / 10

| Share | Color | Type |
| --- | --- | --- |
| 60% canvas | `bg`. White in light mode, black in dark mode. | Work Sans for body, navigation, filters, and meta |
| 30% structure | `surface` (the gray band), `ink`, `muted`, `line` | Fjalla One for page titles, section headings, job titles, and buttons |
| 10% expressive | `accent`, `accent-hover`, `accent-active`, `on-accent`, `accent-focus`, and `accent-soft`. Light base is `#5928ed`. Dark base is `#7a54ff`. | Fjalla One at display size: the hero and live stat numbers |

The brand violet is only on primary CTAs (Apply, Search, Browse, and other default buttons). Secondary and ghost stay ink. Cards sit on the canvas with a 1px border. `surface` is the slightly lighter or darker band under a single statement, not a stack of value-prop columns.

Text contrast stays at WCAG AA for ink and muted on both canvases, and for `on-accent` on `accent`, `accent-hover`, and `accent-active`.

## References

OpenAI’s product and security pages (`openai.com`): black canvas, centered display type, thin-bordered cards, a rounded pill of choices, a row of large numbers with small captions, and a gray section band. Light mode uses the same structure on white.

Job rows use two actions: Read more opens the role, and Apply launches the company posting. The role page and each job card put a compact byline — logo, company, location, and posted age — above the title. A row of `Tag` chips sits directly under the title on the role page — the same labels as the search filters — and omits unknown values plus location and posted age (those live in the byline). The description renders sanitized HTML and clamps to six lines (`--description-preview-lines`) with a fade; Read more appears only when the copy overflows. The role page has one floating **Apply now** control (primary accent, Fjalla One, launch arrow): a full-width safe-area bar on small screens, and a fixed pill at the bottom-right from `640px` up. Page padding and `--shadow-float` keep it off the last line of copy. Each row and the role header show a squircle logo tile to the left of the company name (`CompanyLogo`). The tile has no fill, only a 1px `line` stroke that follows the theme. If the mark is missing, the company’s first letter sits in that outline. The landing hero sits a decorative `TowerLoader` (3D tower by csozi) above the headline. Faces use `tower-left`, `tower-right`, and `tower-top`. Under the hero, body copy says listings are curated from Ashby, Greenhouse, and Lever, above a horizontal `source-reel` of company logo tiles. `prefers-reduced-motion` stops the scroll. Search is a title-or-company field. Filters are chips that open dropdowns, including location. Buttons use Fjalla One at the same weight and letter-spacing as headings, with 1.5rem of left and right padding. Controls use a fixed height and equal inline padding, with no native select chrome. There is no scrolling marquee.

## Themes

`app/globals.css` defines a light set and a dark set. Semantic tokens point at one set. `.dark` on `<html>` swaps the pointers.

The first visit follows `prefers-color-scheme`. The header control is a checkbox (`.theme-checkbox`, `aria-label="Dark mode"`). Checked is dark. It writes `designpool-theme` (`light` or `dark`) to `localStorage`. `themeInitScript` runs before paint. `--toggle-size` is `10px` so the control is 62.5×31.25px in the header. The supplied checkbox CSS keeps `#efefef` and `#2a2a2a` (`toggle-light` / `toggle-dark`) as literal hex; those values are also recorded as `TOGGLE_COLORS`. `prefers-reduced-motion` turns the slide off.

`/design` is a local-only gallery (`npm run dev`). It 404s when `NODE_ENV === "production"` or `VERCEL_ENV` is set, is omitted from the sitemap and robots, and sends `noindex`. The page still shows both palettes at once with `.force-light` and `.force-dark`.

## Where things live

| Piece | Path |
| --- | --- |
| Hex values and theme classes | `app/globals.css` |
| Names, roles, proportions, theme script | `lib/design-tokens.ts` |
| Primitives | `components/ui/` (`Button`, `Badge`, `Tag`, `Surface`, `Eyebrow`, `Field`, `ThemeToggle`, `Container`, `CompanyLogo`, `TowerLoader`, `Logo`) |
| Living gallery | `/design` (local `npm run dev` only) |
| This note | `DESIGN_SYSTEM.md` |

Headings load Fjalla One and body text loads Work Sans through `next/font/google` in `app/layout.tsx`. Body tokens (`TYPE_BODY` in `lib/design-tokens.ts`) set Work Sans at weight 500, `1.125rem`, letter-spacing `-0.02em` (`--tracking-body`), and line-height 1.6. Small copy (`xs` / `sm`, tags and meta) stays at `-0.01em` (`--tracking-meta`). The body scale (`xs`–`xl`) is one step larger than Tailwind’s defaults so copy reads a bit bigger without changing display sizes. Headings use a slight negative letter-spacing (`-0.02em`, and `-0.035em` on `h1` and the `Logo` wordmark) so large Fjalla One lines sit tighter without crowding. The wordmark keeps “Design” in ink and sits “pool” on the accent pill with `on-accent` type. Body measure stays around `max-w-2xl` on reading blocks.

## How this stays durable

`npm test` includes `tests/design-system.test.ts`, which fails when:

- The 60/30/10 shares no longer add up, or a color token is missing from a role.
- A hex value in `lib/design-tokens.ts` disagrees with `app/globals.css`.
- A file under `app/` or `components/` (other than `globals.css`) uses a raw hex, a default Tailwind palette color, a gradient, or a heavy shadow. The theme checkbox hex pair lives only in `globals.css`.
- A listed primitive file is missing, or `DESIGN_SYSTEM.md` and `/design` drop the theme previews.
- The type roles are no longer Fjalla One and Work Sans, or the ticker returns.

To change a color, edit the hex in both `lib/design-tokens.ts` and `app/globals.css`, then run `npm test`.
