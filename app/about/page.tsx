import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

export default function AboutPage() {
  return (
    <Container size="narrow" className="py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">How this board works</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-ink">
        <p>
          Hey, I’m{" "}
          <a href={TYLER_WESSON_URL} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Tyler
          </a>
          , a designer who got tired of digging through stale posts and agency reposts to find good, fresh roles. So
          I built the board I wanted.
        </p>
      </div>

      <h2 className="mt-12 font-display text-3xl">Design roles only</h2>
      <p className="mt-4 text-sm leading-7">
        Product, UX, UI, visual, brand, design systems, research, content, motion, design engineering, and
        leadership. No mechanical, chip, or hardware “design” titles.
      </p>

      <h2 className="mt-12 font-display text-3xl">Straight from the source</h2>
      <p className="mt-4 text-sm leading-7">
        Every listing comes from the company’s own Greenhouse, Ashby, or Lever board. No agencies, no recruiters, no
        reposts. Apply takes you to the original posting.
      </p>

      <h2 className="mt-12 font-display text-3xl">Filters that actually matter</h2>
      <p className="mt-4 text-sm leading-7">
        Filter by what you’re actually looking for: time posted, specific industries, years of experience, and eight
        seniority levels.
      </p>

      <h2 className="mt-12 font-display text-3xl">Always fresh</h2>
      <div className="mt-4 space-y-4 text-sm leading-7">
        <p>
          Nothing older than 30 days. Roles pulled from a company’s board disappear on the next daily check. Age is
          the company’s post date, or the day Designpool first saw it.
        </p>
      </div>

      <h2 className="mt-12 font-display text-3xl">Eight seniority levels</h2>
      <p className="mt-4 text-sm leading-7">One level per role, based on the title first and years asked for second.</p>
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
