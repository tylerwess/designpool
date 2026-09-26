import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SENIORITY_LABELS, SENIORITY_LEVELS, TYPICAL_MIN_YEARS } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "About",
  description: "How Designpool decides seniority and why listings disappear after 30 days.",
};

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
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">How this board works</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-ink">
        <p>
          Designpool lists design roles only: product design, UX, UI and visual, brand, design systems, UX research,
          content design, motion, design engineering, and design leadership. Titles that use “design” for mechanical,
          chip, hardware, or circuit engineering are left out.
        </p>
        <p>
          Listings come from each company’s public Greenhouse, Ashby, or Lever board. The Apply button goes to the
          original posting. Nothing here is an application form.
        </p>
      </div>

      <h2 className="mt-12 font-serif text-3xl">Only 30 days</h2>
      <div className="mt-4 space-y-4 text-sm leading-7">
        <p>
          A role’s age is the date the company posted it, when that date exists. Otherwise it is the day Designpool first
          saw it. Anything older than 30 days is deleted. If a role disappears from the source feed, it is deleted on the
          next daily run, even if it is newer than that.
        </p>
      </div>

      <h2 className="mt-12 font-serif text-3xl">Nine seniority levels</h2>
      <p className="mt-4 text-sm leading-7">Each role gets exactly one level, from the title first and the years asked for second.</p>
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
