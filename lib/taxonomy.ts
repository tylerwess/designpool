export const SENIORITY_LEVELS = [
  "new_grad",
  "entry",
  "mid",
  "senior",
  "staff",
  "principal",
  "manager",
  "director",
  "executive",
] as const;

export type Seniority = (typeof SENIORITY_LEVELS)[number];

export const SENIORITY_LABELS: Record<Seniority, string> = {
  new_grad: "New grad",
  entry: "Entry level",
  mid: "Mid-senior",
  senior: "Senior",
  staff: "Staff",
  principal: "Principal",
  manager: "Manager",
  director: "Director",
  executive: "Executive",
};

/** Typical minimum years for a level. A lower stated minimum earns a Stretch badge. */
export const TYPICAL_MIN_YEARS: Record<Seniority, number> = {
  new_grad: 0,
  entry: 0,
  mid: 2,
  senior: 5,
  staff: 8,
  principal: 10,
  manager: 6,
  director: 10,
  executive: 12,
};

export const INDUSTRIES = [
  { id: "fintech", label: "Fintech" },
  { id: "defense_govtech", label: "Defense/govtech" },
  { id: "ai_ml", label: "AI/ML" },
  { id: "healthcare", label: "Healthcare" },
  { id: "climate", label: "Climate/energy" },
  { id: "dev_tools", label: "Dev tools" },
  { id: "consumer_social", label: "Consumer social" },
  { id: "ecommerce", label: "E-commerce/marketplace" },
  { id: "enterprise", label: "Enterprise SaaS" },
  { id: "productivity", label: "Productivity" },
  { id: "crypto", label: "Crypto/web3" },
  { id: "gaming", label: "Gaming" },
  { id: "media", label: "Media/entertainment" },
  { id: "education", label: "Education" },
  { id: "mobility", label: "Mobility/transportation" },
  { id: "hardware", label: "Hardware/robotics" },
  { id: "security", label: "Security" },
  { id: "travel", label: "Travel/hospitality" },
] as const;

export type IndustryId = (typeof INDUSTRIES)[number]["id"];

export const INDUSTRY_LABELS: Record<IndustryId, string> = Object.fromEntries(
  INDUSTRIES.map((industry) => [industry.id, industry.label]),
) as Record<IndustryId, string>;

export const DISCIPLINES = [
  { id: "product_design", label: "Product design" },
  { id: "ux", label: "UX" },
  { id: "ui_visual", label: "UI/visual" },
  { id: "brand", label: "Brand" },
  { id: "design_systems", label: "Design systems" },
  { id: "ux_research", label: "UX research" },
  { id: "content_design", label: "Content design" },
  { id: "motion", label: "Motion" },
  { id: "design_engineering", label: "Design engineering" },
  { id: "design_leadership", label: "Design leadership" },
] as const;

export type DisciplineId = (typeof DISCIPLINES)[number]["id"];

export const DISCIPLINE_LABELS: Record<DisciplineId, string> = Object.fromEntries(
  DISCIPLINES.map((discipline) => [discipline.id, discipline.label]),
) as Record<DisciplineId, string>;

export const SIZE_BUCKETS = ["1-50", "51-200", "201-1000", "1000+"] as const;
export type SizeBucket = (typeof SIZE_BUCKETS)[number];

export const WORK_TYPES = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "Onsite" },
] as const;

export type WorkType = (typeof WORK_TYPES)[number]["id"] | "unknown";

export const EMPLOYMENT_TYPES = [
  { id: "full_time", label: "Full-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]["id"];

export const POSTED_WINDOWS = [
  { id: "24h", label: "24 hours" },
  { id: "3d", label: "3 days" },
  { id: "7d", label: "7 days" },
  { id: "14d", label: "14 days" },
  { id: "30d", label: "30 days" },
] as const;

export type Ats = "greenhouse" | "ashby" | "lever";

export function isSeniority(value: string): value is Seniority {
  return (SENIORITY_LEVELS as readonly string[]).includes(value);
}

export function isIndustry(value: string): value is IndustryId {
  return value in INDUSTRY_LABELS;
}

export function isDiscipline(value: string): value is DisciplineId {
  return value in DISCIPLINE_LABELS;
}

export function isSizeBucket(value: string): value is SizeBucket {
  return (SIZE_BUCKETS as readonly string[]).includes(value);
}

export function industryLabel(id: string): string {
  return isIndustry(id) ? INDUSTRY_LABELS[id] : id;
}

export function disciplineLabel(id: string): string {
  return isDiscipline(id) ? DISCIPLINE_LABELS[id] : id;
}
