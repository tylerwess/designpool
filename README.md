# Designpool

A minimal public job board for design roles. It pulls openings from company Greenhouse, Ashby, and Lever boards, classifies each one into one of nine seniority levels, and deletes anything older than 30 days.

The interface has light and dark mode and a small design system. Tokens, type, and components are documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and rendered at [/design](/design). Change colors in `lib/design-tokens.ts` and `app/globals.css` together. `npm test` checks that they still match.

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

The route ingests every company, deletes roles that disappeared from their source feed, then deletes anything older than 30 days. A missing or wrong secret returns 401.

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
| `DATABASE_URL` | For listings | Postgres connection string, for example Neon from the Vercel Marketplace. When it is unset outside Vercel, the app uses local SQLite. When it is unset on Vercel, the build still succeeds and the site shows an empty state. |
| `CRON_SECRET` | For cron | Sent by Vercel as `Authorization: Bearer <CRON_SECRET>`. The cron route rejects every request without it. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for metadata, `/sitemap.xml`, and Open Graph. Defaults to `https://designpool-taupe.vercel.app`. |
| `LLM_CLASSIFIER_ENABLED` | No | Defaults to `false`. The title and years rules run on their own. |
| `LLM_API_URL`, `LLM_API_KEY`, `LLM_MODEL` | Only if the LLM flag is `true` | Optional pass for ambiguous “Lead” titles. Failures fall back to the rules. |

On a fresh Vercel deploy, before `DATABASE_URL` is set, the site renders an empty state instead of failing the build.

## Deploy on Vercel

The Vercel project is `designpool`. Production is [https://designpool-taupe.vercel.app](https://designpool-taupe.vercel.app). Pushes and pull requests get preview deployments. Metadata, the sitemap, and Open Graph use that production origin unless `NEXT_PUBLIC_SITE_URL` is set.

1. The framework preset is Next.js. Node 22 is set in `package.json`.
2. `CRON_SECRET` is set for Production and Preview. Vercel Cron sends it as a bearer token.
3. Add Neon Postgres from Vercel Storage and connect it so `DATABASE_URL` is set for Production, Preview, and Development. Until that variable exists, the build succeeds and `/` and `/jobs` show an empty state instead of failing.
4. `vercel.json` schedules `GET /api/cron` once a day (`15 8 * * *`, 08:15 UTC). The route exports `maxDuration` of 60 seconds, the usual Hobby-plan ceiling. A full ingest of the seeded companies finished in well under a minute locally. On Pro you can raise that export if a run ever times out. You can also fill the database from your machine:

   ```bash
   DATABASE_URL="postgres://…" npm run ingest
   ```

5. After `DATABASE_URL` is set, deploy and trigger ingest once:

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://designpool-taupe.vercel.app/api/cron
   ```

6. Confirm a later cron run in the Vercel dashboard under Cron Jobs. Each run ingests, then deletes stale and 30-day-old listings. `/sitemap.xml` and `/robots.txt` use the canonical site URL, and the sitemap includes job URLs once the database has listings.

Leave `LLM_CLASSIFIER_ENABLED` unset or `false` unless you want the optional model pass.

## How seniority is decided

Each role gets one level from the title: New grad, Entry level, Mid-senior, Senior, Staff, Principal, Manager, Director, or Executive. Years of experience are parsed from the description (`5+ years`, `3-5 years`, `3 to 5 years`, `at least 4 years`, `minimum of 6 years`, and spelled-out numbers). Unrelated numbers, such as “5 years of runway” or a company age, are ignored.

If the title asks for fewer years than that level usually does, the title is kept and the role is marked Stretch. Roles that never state years use the title only.

## Scripts

- `npm run dev` — local site
- `npm test` — years parser, seniority classifier, filters, and the design-token contract
- `npm run ingest` — fetch live boards into the configured database
- `npm run verify-companies` — check that each configured token still returns jobs
- `npm run lint` — ESLint
