import type {
  Ats,
  DisciplineId,
  EmploymentType,
  IndustryId,
  Seniority,
  SizeBucket,
  WorkType,
} from "./taxonomy";

export type Listing = {
  id: string;
  source: Ats;
  externalId: string;
  company: string;
  companyToken: string;
  title: string;
  url: string;
  location: string | null;
  remoteType: WorkType;
  employmentType: EmploymentType;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  salaryInterval: string | null;
  description?: string;
  postedAt: string | null;
  sourceUpdatedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  seniority: Seniority;
  stretch: boolean;
  yearsMin: number | null;
  yearsMax: number | null;
  industry: IndustryId;
  sizeBucket: SizeBucket;
  disciplines: DisciplineId[];
  /** Read from the description: offers OPT, relocation help, visa sponsorship. */
  opt: boolean;
  relocation: boolean;
  sponsorsVisa: boolean;
};

export type ListingDraft = Listing & { description: string };
