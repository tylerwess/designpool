import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GrokBot } from "@/components/ui/GrokBot";
import { pageMetadata } from "@/lib/site";
import { SENIORITY_LABELS, SENIORITY_LEVELS, TYPICAL_MIN_YEARS } from "@/lib/taxonomy";

const TYLER_WESSON_URL = "https://www.tylerwdesign.site/";

export const metadata = pageMetadata({
  path: "/about",
  title: "About",
  description: "How Designpool decides seniority and why listings disappear after 30 days.",
});

const notes = [
  "Lead is an individual-contributor level (Staff) unless the description mentions people management, such as direct reports, hiring, or growing a team. Then it is Manager.",
  "Head of Design follows company size. Under about 200 people it is Executive. At a larger company it is Director.",
  "If the title and the years disagree, the title wins. A Senior role that asks for 3+ years keeps the Senior level and gets a Stretch badge.",
  "When a posting never states years, the level comes from the title alone.",
];

/** Icon box (2rem) + heading gap (0.75rem) = 2.75rem, so body copy lines up under the heading text, not the icon. */
const SECTION_INDENT = "pl-11";

function IconIndent({ icon }: { icon: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent"
    >
      {icon}
    </span>
  );
}

function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-12 flex items-center gap-3">
      <IconIndent icon={icon} />
      <h2 className="font-display text-3xl">{children}</h2>
    </div>
  );
}

function RolesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5 14.5 5 8 8.5 1.5 5 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.5 8 8 11.5 14.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 11 8 14.5 14.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.5 9.5 14 2M14 2h-4.5M14 2v4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 9v3.5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1H6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.5 2h13L9.5 8.3v4.4L6.5 14V8.3L1.5 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9.6" r="5.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 4.4V2.6M8 2.6c-.7-1-2-1.2-3-.8M8 2.6c.7-1 2-1.2 3-.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LevelsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 13.5v-3M6 13.5v-6M10 13.5v-9M14 13.5V6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <Container size="narrow" className="py-14">
      <GrokBot className="mb-4" />
      <Eyebrow>About</Eyebrow>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">How this board works</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-ink">
        <p>
          Hey, I’m{" "}
          <a href={TYLER_WESSON_URL} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Tyler
          </a>
          , a designer who kept hearing the same pain points from young designers job hunting: boards full of stale
          roles that closed weeks ago, seniority filters too broad to mean anything, and industry filters that never
          match what they actually do. I built a job board that makes more sense.
        </p>
      </div>

      <SectionHeading icon={<FreshIcon />}>Always fresh</SectionHeading>
      <div className={`mt-4 space-y-4 text-sm leading-7 ${SECTION_INDENT}`}>
        <p>
          Nothing older than 30 days. Roles pulled from a company’s board disappear on the next daily check. Age is
          the company’s post date, or the day Designpool first saw it.
        </p>
      </div>

      <SectionHeading icon={<RolesIcon />}>Design roles only</SectionHeading>
      <p className={`mt-4 text-sm leading-7 ${SECTION_INDENT}`}>
        Product, UX, UI, visual, brand, design systems, research, content, motion, design engineering, and
        leadership. No mechanical, chip, or hardware “design” titles.
      </p>

      <SectionHeading icon={<SourceIcon />}>Straight from the source</SectionHeading>
      <p className={`mt-4 text-sm leading-7 ${SECTION_INDENT}`}>
        Every listing comes from the company’s own Greenhouse, Ashby, or Lever board. No agencies, no recruiters, no
        reposts. Apply takes you to the original posting.
      </p>

      <SectionHeading icon={<FilterIcon />}>Filters that actually matter</SectionHeading>
      <p className={`mt-4 text-sm leading-7 ${SECTION_INDENT}`}>
        Filter by what you’re actually looking for: time posted, specific industries, years of experience, and eight
        seniority levels.
      </p>

      <SectionHeading icon={<LevelsIcon />}>Eight seniority levels</SectionHeading>
      <p className={`mt-4 text-sm leading-7 ${SECTION_INDENT}`}>
        One level per role, based on the title first and years asked for second.
      </p>
      <table className="mt-6 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
            <th className="py-2 font-normal">Level</th>
            <th className="py-2 font-normal">Typical years</th>
          </tr>
        </thead>
        <tbody>
          {SENIORITY_LEVELS.map((level) => (
            <tr key={level} className="border-b border-line">
              <td className="py-2">{SENIORITY_LABELS[level]}</td>
              <td className="py-2 text-muted">{TYPICAL_MIN_YEARS[level] === 0 ? "0–2" : `${TYPICAL_MIN_YEARS[level]}+`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-6 space-y-3 text-sm leading-6 text-muted">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </Container>
  );
}
