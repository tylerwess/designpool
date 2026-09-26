import { JobCard } from "@/components/JobCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fieldClassName, FieldLabel } from "@/components/ui/Field";
import { Surface } from "@/components/ui/Surface";
import { COLOR_ROLES, COLOR_TOKENS, PROPORTIONS, TYPE_BODY, TYPE_ROLES, type ColorToken } from "@/lib/design-tokens";
import { pageMetadata } from "@/lib/site";
import type { Listing } from "@/lib/types";

export const metadata = pageMetadata({
  path: "/design",
  title: "Design system",
  description: "Tokens, type, and components for Designpool. Light and dark share one set of names.",
});

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
      <p className="mt-3 font-display text-3xl leading-tight">The design job board that respects your time.</p>
      <p className="mt-3 text-sm leading-6 text-muted">Black or white canvas, thin borders, the same class names in both themes.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent px-4 py-2 text-sm text-on-accent">Browse</span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink">Staff</span>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Container className="py-14">
      <Eyebrow>Design system</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
        Flat surfaces, thin borders, two themes.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
        Pages are built from the primitives on this page. Color and type follow 60/30/10. The header control switches
        the live theme. The pair below is locked to light and dark so both stay visible either way.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl">60 / 30 / 10</h2>
        <div className="mt-5 flex h-28 overflow-hidden rounded-xl border border-line text-xs">
          <div className="flex items-end bg-bg p-3 text-ink" style={{ width: `${PROPORTIONS.canvas}%` }}>
            Canvas {PROPORTIONS.canvas}
          </div>
          <div className="flex items-end border-l border-line bg-surface p-3 text-ink" style={{ width: `${PROPORTIONS.structure}%` }}>
            Structure {PROPORTIONS.structure}
          </div>
          <div className="flex items-end bg-accent p-3 text-on-accent" style={{ width: `${PROPORTIONS.expressive}%` }}>
            {PROPORTIONS.expressive}
          </div>
        </div>
        <dl className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <dt className="font-display text-xl">Canvas · {PROPORTIONS.canvas}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">The page background. Most of what you see.</dd>
          </div>
          <div>
            <dt className="font-display text-xl">Structure · {PROPORTIONS.structure}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">
              Surfaces, ink, muted text, and 1px rules. Headings in roman serif sit in this share too.
            </dd>
          </div>
          <div>
            <dt className="font-display text-xl">Expressive · {PROPORTIONS.expressive}%</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">
              Primary CTAs use the brand accent. Display-size Fjalla One is the hero and the live stat numbers.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Color</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Roles: canvas {COLOR_ROLES.canvas.join(", ")}; structure {COLOR_ROLES.structure.join(", ")}; expressive{" "}
          {COLOR_ROLES.expressive.join(", ")}.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {(["light", "dark"] as const).map((theme) => (
            <div key={theme}>
              <h3 className="font-display text-xl capitalize">{theme}</h3>
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
        <h2 className="font-display text-3xl">Type</h2>
        <div className="mt-6 grid gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.body.share}% · {TYPE_ROLES.body.family}
            </p>
            <p className="mt-2 max-w-2xl text-base leading-7">
              {TYPE_ROLES.body.use} This sentence is the body face at {TYPE_BODY.weight} / {TYPE_BODY.size} /{" "}
              {TYPE_BODY.tracking}.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.structure.share}% · {TYPE_ROLES.structure.family}
            </p>
            <p className="mt-2 font-display text-4xl">The design job board that respects your time.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {TYPE_ROLES.expressive.share}% · {TYPE_ROLES.expressive.family}
            </p>
            <p className="mt-2 font-display text-6xl">Aa</p>
            <p className="mt-2 text-sm text-muted">Display size. Live counts on the site come from the database.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Components</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href="/jobs">Primary</Button>
          <Button href="/jobs" variant="secondary">
            Secondary
          </Button>
          <Button href="/jobs" variant="ghost">
            Read more
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="accent">Senior</Badge>
          <Badge>Stretch</Badge>
          <Badge>Remote</Badge>
          <Badge>Salary</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag href="/jobs?seniority=senior">Senior</Tag>
          <Tag href="/jobs?industry=productivity">Productivity</Tag>
          <Tag href="/jobs?work=remote">Remote</Tag>
          <Tag href="/jobs?salary=1">Has salary</Tag>
          <Tag href="/jobs?employment=full_time">Full-time</Tag>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CompanyLogo name="Figma" website="https://www.figma.com" size="sm" />
            <span>Figma · card size</span>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <CompanyLogo name="Figma" website="https://www.figma.com" size="lg" />
            <span>Figma · detail size</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <CompanyLogo name="Unknown Co" size="sm" />
            <span>Letter fallback</span>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="force-light flex items-center gap-2 rounded-xl border border-line bg-bg p-4 text-sm text-ink">
            <CompanyLogo name="Figma" website="https://www.figma.com" size="sm" />
            <span>Light</span>
          </div>
          <div className="force-dark flex items-center gap-2 rounded-xl border border-line bg-bg p-4 text-sm text-ink">
            <CompanyLogo name="Figma" website="https://www.figma.com" size="sm" />
            <span>Dark</span>
          </div>
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
