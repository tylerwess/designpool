import { companies } from "../data/companies";
import type { DisciplineId, Seniority, WorkType } from "./taxonomy";
import type { Listing } from "./types";

/**
 * Local preview data. In `next dev`, when the database has no fresh roles (the local SQLite file
 * ages out after 30 days), the board serves these instead so every page renders like production.
 * Never used in a production build. Set DESIGNPOOL_MOCK=0 to see the real empty state locally.
 */
export function mockDataEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.DESIGNPOOL_MOCK !== "0";
}

const HOUR_MS = 60 * 60 * 1000;

/** Small deterministic PRNG so the mock board is the same on every reload. */
function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

const ROLES: { title: string; seniority: Seniority; disciplines: DisciplineId[]; years: [number, number | null] | null }[] = [
  { title: "Product Designer", seniority: "mid", disciplines: ["product_design"], years: [3, 5] },
  { title: "Senior Product Designer", seniority: "senior", disciplines: ["product_design"], years: [5, 8] },
  { title: "Staff Product Designer", seniority: "staff", disciplines: ["product_design"], years: [8, null] },
  { title: "Principal Designer, Platform", seniority: "principal", disciplines: ["product_design", "design_systems"], years: [10, 15] },
  { title: "Design Systems Designer", seniority: "senior", disciplines: ["design_systems", "ui_visual"], years: [5, 7] },
  { title: "Brand Designer", seniority: "mid", disciplines: ["brand"], years: [2, 4] },
  { title: "Senior Brand Designer", seniority: "senior", disciplines: ["brand", "motion"], years: [4, 7] },
  { title: "UX Researcher", seniority: "mid", disciplines: ["ux_research"], years: [3, 6] },
  { title: "Content Designer", seniority: "mid", disciplines: ["content_design"], years: [3, 5] },
  { title: "Motion Designer", seniority: "mid", disciplines: ["motion"], years: [2, 5] },
  { title: "Design Engineer", seniority: "senior", disciplines: ["design_engineering"], years: [4, 8] },
  { title: "Associate Product Designer", seniority: "new_grad", disciplines: ["product_design", "ux"], years: [0, 2] },
  { title: "Design Manager", seniority: "manager", disciplines: ["design_leadership"], years: [7, 10] },
  { title: "Director of Design", seniority: "director", disciplines: ["design_leadership"], years: [12, null] },
  { title: "Head of Design", seniority: "executive", disciplines: ["design_leadership"], years: null },
];

const LOCATIONS: { location: string; remote: WorkType }[] = [
  { location: "San Francisco, CA", remote: "hybrid" },
  { location: "New York, NY", remote: "hybrid" },
  { location: "Remote (US)", remote: "remote" },
  { location: "Seattle, WA", remote: "onsite" },
  { location: "London, UK", remote: "hybrid" },
  { location: "Remote", remote: "remote" },
];

const DESCRIPTION = `<p>We're looking for a designer to shape how people use our product every day. You'll partner with engineering and product from the first sketch to what ships.</p>
<h3>What you'll do</h3><ul><li>Own end-to-end flows across web and mobile</li><li>Prototype early and test with real users</li><li>Contribute to and extend our design system</li></ul>
<h3>About you</h3><ul><li>A portfolio that shows your process and craft</li><li>Comfort working in ambiguity and explaining your decisions</li></ul>`;

/**
 * About 120 fresh roles spread across the first 40 companies, weighted so a few companies hire a lot
 * (like the live board), posted over the last 30 days with more of them recent.
 */
export function mockListings(now = Date.now()): Listing[] {
  const random = rng(7);
  const pool = companies.slice(0, 40);
  const listings: Listing[] = [];
  pool.forEach((company, index) => {
    const count = Math.max(1, Math.round(12 / (1 + index * 0.45)));
    for (let n = 0; n < count; n += 1) {
      const role = ROLES[Math.floor(random() * ROLES.length)];
      const place = LOCATIONS[Math.floor(random() * LOCATIONS.length)];
      // Squaring skews posting ages toward the present, so the trend rises toward today.
      const ageHours = Math.floor(random() ** 2 * 29 * 24) + 1;
      const posted = new Date(now - ageHours * HOUR_MS).toISOString();
      const hasSalary = random() > 0.35;
      const base = 110 + Math.floor(random() * 90);
      const externalId = `mock-${company.token}-${n + 1}`;
      const [yearsMin, yearsMax] = role.years ?? [null, null];
      listings.push({
        id: `${company.ats}:${company.token}:${externalId}`,
        source: company.ats,
        externalId,
        company: company.name,
        companyToken: company.token,
        title: role.title,
        url: company.website,
        location: place.location,
        remoteType: place.remote,
        employmentType: role.seniority === "new_grad" && random() > 0.6 ? "internship" : "full_time",
        salaryMin: hasSalary ? base * 1000 : null,
        salaryMax: hasSalary ? (base + 40) * 1000 : null,
        salaryCurrency: hasSalary ? "USD" : null,
        salaryInterval: hasSalary ? "year" : null,
        description: DESCRIPTION,
        postedAt: posted,
        sourceUpdatedAt: posted,
        firstSeenAt: posted,
        lastSeenAt: new Date(now).toISOString(),
        seniority: role.seniority,
        stretch: random() > 0.85,
        yearsMin,
        yearsMax,
        industry: company.industry,
        sizeBucket: company.sizeBucket,
        disciplines: role.disciplines,
        opt: random() > 0.8,
        relocation: random() > 0.75,
        sponsorsVisa: random() > 0.7,
      });
    }
  });
  return listings.sort((a, b) => Date.parse(b.postedAt!) - Date.parse(a.postedAt!));
}
