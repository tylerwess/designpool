# Designpool

A minimal public job board for design roles. It pulls openings from company Greenhouse, Ashby, and Lever boards, classifies each one into one of eight seniority levels, and deletes anything older than 30 days.

The interface has light and dark mode and a small design system. Tokens, type, and components are documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). The living gallery at `/design` is local `npm run dev` only; production builds return 404. Change colors in `lib/design-tokens.ts` and `app/globals.css` together. `npm test` checks that they still match.

## Local setup

You need Node.js 22 or newer.

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `DATABASE_URL` is unset, the app stores listings in `data/designpool.sqlite`. That file is created on the first ingest and is gitignored. No cloud account is required to run locally.

Fill the board:

```bash
npm run ingest
```

The jobs page reads that database. Filters live in the URL, so a view can be shared.

To exercise the cron route locally, set a secret and start the dev server:

```bash
CRON_SECRET=dev-secret npm run dev
```

```bash
curl -H "Authorization: Bearer dev-secret" http://localhost:3000/api/cron
```

The route ingests the boards named in `INGEST_SOURCES` (Greenhouse, Ashby, and Lever when that variable is unset). For each company whose feed was fetched successfully, it deletes roles that disappeared from that feed. It does not treat listings from a disabled source as stale. It then deletes anything older than 30 days. With `CRON_SECRET` unset, or with a missing or wrong bearer token, the route returns 401 and does not ingest.

## Adding a company

Edit `data/companies.ts`. Each entry needs:

| Field | Notes |
| --- | --- |
| `name` | Display name |
| `ats` | `greenhouse`, `ashby`, or `lever` |
| `token` | Board slug used by that ATS |
| `industry` | One of the ids in `lib/taxonomy.ts` |
| `sizeBucket` | `1-50`, `51-200`, `201-1000`, or `1000+`. Under 200 people, “Head of Design” is classified as Executive; larger companies are Director. |
| `website` | Company site |

Board URLs:

- Greenhouse: `https://boards-api.greenhouse.io/v1/boards/{token}/jobs`
- Ashby: `https://api.ashbyhq.com/posting-api/job-board/{token}`
- Lever: `https://api.lever.co/v0/postings/{token}?mode=json`

Check that the token still returns jobs, then ingest:

```bash
npm run verify-companies
npm run ingest
```

`verify-companies` only checks that the public board responds with at least one job. It does not require a design role to be open today.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | For listings | Neon Postgres connection string. Set it as a Worker secret. When it is unset locally, the app uses SQLite. When it is unset on Cloudflare, the site renders an empty state. |
| `CRON_SECRET` | For cron | Bearer token for `/api/cron`. Set it as a Worker secret. While it is unset, every request to that route returns 401 and the scheduled ingest skips. |
| `INGEST_SOURCES` | No | Comma-separated boards to fetch: `greenhouse`, `ashby`, `lever`. Unset or blank means all three. Set in `wrangler.jsonc` under `vars`. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for metadata, `/sitemap.xml`, and Open Graph. Defaults to `https://designpool.io`. It is read at build time. |
| `LLM_CLASSIFIER_ENABLED` | No | Defaults to `false`. The title and years rules run on their own. |
| `LLM_API_URL`, `LLM_API_KEY`, `LLM_MODEL` | Only if the LLM flag is `true` | Optional pass for ambiguous “Lead” titles. Failures fall back to the rules. Set the key as a Worker secret. |

## Deploy on Cloudflare Workers

The site runs on Cloudflare Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare). The Worker is named `designpool` and serves `designpool.io`. It needs the Workers Paid plan: the free plan's 10 ms CPU limit and 50 subrequests per run are too small for server rendering and the daily ingest.

How the pieces map:

- `wrangler.jsonc` configures the Worker, its static assets, plain-text vars, and the cron trigger.
- `open-next.config.ts` configures the adapter. Data pages are `force-dynamic`, so there is no incremental cache. Prerendered routes are served from static assets.
- `cloudflare/worker.ts` is the Worker entry. It serves the app and adds a `scheduled` handler that calls `/api/cron` in-process with `CRON_SECRET`. The daily ingest still runs in three parts, an hour apart: `part=1&parts=3` at 08:15 UTC, `part=2` at 09:15 and `part=3` at 10:15. Each fetches every third company in `data/companies.ts`. Workers allow far longer runs than Vercel Hobby did, so one full run (`/api/cron` with no `part`) would also fit; the split is kept so the daily stats and timing stay as they were.
- `lib/db.ts` opens one Postgres connection per request on Workers, because a Worker cannot reuse a socket across requests. In Node (`npm run dev`, scripts) it keeps one shared connection as before.
- The display font for the icons and Open Graph image is embedded in `lib/display-font.ts`, because Workers have no project filesystem. Run `npm run embed-font` after replacing the font.

First deploy:

1. Log in: `npx wrangler login`.
2. Add the secrets:

   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put CRON_SECRET
   ```

3. Deploy: `npm run deploy`. Check the site on its `designpool.<account>.workers.dev` URL.
4. Run ingest once by hand:

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://designpool.<account>.workers.dev/api/cron
   ```

   There is no separate migration step. The first database call creates the `listings` table with `CREATE TABLE IF NOT EXISTS`, and later columns are added with a best-effort `ALTER TABLE ... ADD COLUMN`. Stale deletion runs only for a company that was fetched in that run. Roles older than 30 days are always deleted.

5. Add `designpool.io` to Cloudflare as a zone. Then add `designpool.io` and `www.designpool.io` under the Worker's **Settings → Domains & Routes → Custom domain**.

For automatic deploys on push, connect the GitHub repo under the Worker's **Settings → Builds**. Use `npx opennextjs-cloudflare build` as the build command and `npx opennextjs-cloudflare deploy` as the deploy command.

Scheduled runs and their logs are under the Worker's **Settings → Trigger Events** and **Observability**. To test the scheduled handler locally, run `npx wrangler dev --test-scheduled` after a build, then open `/__scheduled?cron=15+8+*+*+*`.

Leave `LLM_CLASSIFIER_ENABLED` as `false` unless you want the optional model pass.

## How seniority is decided

Each role gets one level from the title: New grad/Entry level, Mid-senior, Senior, Staff, Principal, Manager, Director, or Executive. Years of experience are parsed from the description (`5+ years`, `3-5 years`, `3 to 5 years`, `at least 4 years`, `minimum of 6 years`, and spelled-out numbers). Unrelated numbers, such as “5 years of runway” or a company age, are ignored.

If the title asks for fewer years than that level usually does, the title is kept and the role is marked Stretch. Roles that never state years use the title only.

## Scripts

- `npm run dev` — local site
- `npm test` — years parser, seniority classifier, filters, and the design-token contract
- `npm run ingest` — fetch live boards into the configured database
- `npm run verify-companies` — check that each configured token still returns jobs
- `npm run lint` — ESLint
