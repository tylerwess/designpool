# designpool

A curated **design job board** for product, brand, motion, UX, and design-systems roles.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS v4.

## Getting started

Requirements: Node.js 20+ (the dev environment uses Node 22).

```bash
npm ci        # install exact dependencies from package-lock.json
npm run dev   # start the dev server at http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server on port 3000 |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  app/            # App Router entrypoints (layout, page, global styles)
  components/     # JobBoard (client) and JobCard UI
  lib/jobs.ts     # Job type definitions and sample listings
```

The listings in `src/lib/jobs.ts` are sample data; the board supports
client-side search and filtering by role category, job type, and remote status.
