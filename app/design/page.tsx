import type { Metadata } from "next";
import { JobCard } from "@/components/JobCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fieldClassName, FieldLabel } from "@/components/ui/Field";
import { Surface } from "@/components/ui/Surface";
import { COLOR_ROLES, COLOR_TOKENS, PROPORTIONS, TYPE_ROLES, type ColorToken } from "@/lib/design-tokens";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, type, and components for Designpool. Light and dark share one set of names.",
};

const sample: Listing = {
  id: "sample",
  source: "greenhouse",
  externalId: "sample",
  company: "Figma",
  companyToken: "figma",
  title: "Staff Product Designer",
  url: "https://www.figma.com/careers",
  location: "San Francisco",
  remoteType: "remote",
  employmentType: "full_time",
  salaryMin: 180000,
  salaryMax: 240000,
  salaryCurrency: "USD",
  salaryInterval: "1 YEAR",
  postedAt: "2026-09-23T12:00:00.000Z",
  sourceUpdatedAt: null,
  firstSeenAt: "2026-09-23T12:00:00.000Z",
  lastSeenAt: "2026-09-23T12:00:00.000Z",
  seniority: "staff",
  stretch: true,
  yearsMin: 5,
  yearsMax: 8,
  industry: "productivity",
  sizeBucket: "1000+",
  disciplines: ["product_design", "design_systems"],
};

function Swatch({ theme, token }: { theme: "light" | "dark"; token: ColorToken }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="h-14" style={{ background: `var(--${theme}-${token})` }} />
      <p className="px-3 py-2 text-xs text-muted">{token}</p>
    </div>
  );
}

function ThemePreview({ mode, label }: { mode: "force-light" | "force-dark"; label: string }) {
  return (
    <div className={`${mode} rounded-xl border border-line bg-bg p-6 text-ink`}>
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 font-serif text-3xl leading-tight">
        Filters that respect the <span className="italic text-accent">craft.</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">Canvas, ink, and one accent. The same class names in both themes.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-ink px-4 py-2 text-sm text-bg">Browse</span>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">Staff</span>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Container className="py-14">
      <Eyebrow>Design system</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
        One palette, two themes, a small expressive share.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
        Pages are built from the primitives on this page. Color and type follow 60/30/10. The header control switches
        the live theme. The pair below is locked to light and dark so both stay visible either way.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-3xl">60 / 30 / 10</h2>
        <div className="mt-5 flex h-28 overflow-hidden rounded-xl border border-line text-xs">
          <div className="flex items-end bg-bg p-3 text-ink" style={{ width: `${PROPORTIONS.canvas}%` }}>
            Canvas {PROPORTIONS.canvas}
          </div>
          <div className="flex items-end border-l border-line bg-surface p-3 text-ink" style={{ width: `${PROPORTIONS.structure}%` }}>
            Structure {PROPORTIONS.structure}
          </div>
          <div className="flex items-end bg-accent p-3 text-bg" style={{ width: `${PROPORTIONS.expressive}%` }}>
            {PROPORTIONS.expressive}
          </div>
        </div>
        <dl className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <dt className="font-serif text-xl">Canvas · {PROPORTIONS.canvas}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">The page background. Most of what you see.</dd>
          </div>
          <div>
            <dt className="font-serif text-xl">Structure · {PROPORTIONS.structure}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">
              Surfaces, ink, muted text, and 1px rules. Headings in roman serif sit in this share too.
            </dd>
          </div>
          <div>
            <dt className="font-serif text-xl">Expressive · {PROPORTIONS.expressive}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">
              Accent clay, italic serif, the discipline ticker, and seniority badges. Not large fills.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Color</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Roles: canvas {COLOR_ROLES.canvas.join(", ")}; structure {COLOR_ROLES.structure.join(", ")}; expressive{" "}
          {COLOR_ROLES.expressive.join(", ")}.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {(["light", "dark"] as const).map((theme) => (
            <div key={theme}>
              <h3 className="font-serif text-xl capitalize">{theme}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {COLOR_TOKENS.map((token) => (
                  <Swatch key={token} theme={theme} token={token} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ThemePreview mode="force-light" label="Light" />
          <ThemePreview mode="force-dark" label="Dark" />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Type</h2>
        <div className="mt-6 grid gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.body.share}% · {TYPE_ROLES.body.family}
            </p>
            <p className="mt-2 max-w-2xl text-base leading-7">
              {TYPE_ROLES.body.use} This sentence is the body face.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.structure.share}% · {TYPE_ROLES.structure.family}
            </p>
            <p className="mt-2 font-serif text-4xl">Open roles, kept for 30 days.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.expressive.share}% · {TYPE_ROLES.expressive.family}
            </p>
            <p className="mt-2 font-serif text-4xl italic text-accent">craft.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Components</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href="/jobs">Primary</Button>
          <Button href="/jobs" variant="secondary">
            Secondary
          </Button>
          <Button href="/jobs" variant="ghost">
            View →
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="accent">Senior</Badge>
          <Badge>Stretch</Badge>
          <Badge>Remote</Badge>
          <Badge>Salary</Badge>
        </div>
        <label className="mt-6 block max-w-sm text-sm">
          <FieldLabel>Search</FieldLabel>
          <input className={fieldClassName} placeholder="Title or company" readOnly />
        </label>
        <div className="mt-6">
          <JobCard listing={sample} titleHref="/jobs" />
        </div>
        <Surface className="mt-4 p-5 text-sm leading-6">Empty and message states use this surface.</Surface>
      </section>
    </Container>
  );
}
