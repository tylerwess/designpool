export type JobType = "Full-time" | "Contract" | "Part-time";

export type JobCategory =
  | "Product Design"
  | "UX Design"
  | "Brand & Visual"
  | "Motion & 3D"
  | "Design Systems";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  remote: boolean;
  type: JobType;
  category: JobCategory;
  salary: string;
  postedDaysAgo: number;
  tags: string[];
  featured?: boolean;
}

export const CATEGORIES: JobCategory[] = [
  "Product Design",
  "UX Design",
  "Brand & Visual",
  "Motion & 3D",
  "Design Systems",
];

export const JOB_TYPES: JobType[] = ["Full-time", "Contract", "Part-time"];

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Northwind Labs",
    companyInitials: "NL",
    location: "San Francisco, CA",
    remote: true,
    type: "Full-time",
    category: "Product Design",
    salary: "$150k–$185k",
    postedDaysAgo: 1,
    tags: ["Figma", "Prototyping", "0→1"],
    featured: true,
  },
  {
    id: "2",
    title: "Brand Designer",
    company: "Fable Studio",
    companyInitials: "FS",
    location: "Remote (US)",
    remote: true,
    type: "Contract",
    category: "Brand & Visual",
    salary: "$80–$110 / hr",
    postedDaysAgo: 2,
    tags: ["Identity", "Illustration", "Typography"],
  },
  {
    id: "3",
    title: "Lead UX Designer",
    company: "Meridian Health",
    companyInitials: "MH",
    location: "Boston, MA",
    remote: false,
    type: "Full-time",
    category: "UX Design",
    salary: "$140k–$170k",
    postedDaysAgo: 3,
    tags: ["Research", "Accessibility", "Healthcare"],
    featured: true,
  },
  {
    id: "4",
    title: "Motion Designer",
    company: "Pixelforge",
    companyInitials: "PF",
    location: "Los Angeles, CA",
    remote: true,
    type: "Full-time",
    category: "Motion & 3D",
    salary: "$115k–$140k",
    postedDaysAgo: 4,
    tags: ["After Effects", "Blender", "Product Video"],
  },
  {
    id: "5",
    title: "Design Systems Engineer",
    company: "Cobalt",
    companyInitials: "CO",
    location: "Remote (Global)",
    remote: true,
    type: "Full-time",
    category: "Design Systems",
    salary: "$160k–$195k",
    postedDaysAgo: 5,
    tags: ["Tokens", "React", "Storybook"],
  },
  {
    id: "6",
    title: "Product Designer (Growth)",
    company: "Loop Commerce",
    companyInitials: "LC",
    location: "New York, NY",
    remote: false,
    type: "Full-time",
    category: "Product Design",
    salary: "$130k–$160k",
    postedDaysAgo: 6,
    tags: ["Experimentation", "Data-informed", "Web"],
  },
  {
    id: "7",
    title: "UX Researcher",
    company: "Atlas Mobility",
    companyInitials: "AM",
    location: "Remote (EU)",
    remote: true,
    type: "Part-time",
    category: "UX Design",
    salary: "€45–€65 / hr",
    postedDaysAgo: 8,
    tags: ["Interviews", "Usability", "Synthesis"],
  },
  {
    id: "8",
    title: "Visual Designer",
    company: "Sunset Media",
    companyInitials: "SM",
    location: "Austin, TX",
    remote: true,
    type: "Contract",
    category: "Brand & Visual",
    salary: "$70–$95 / hr",
    postedDaysAgo: 11,
    tags: ["Marketing", "Social", "Layout"],
  },
  {
    id: "9",
    title: "3D Product Artist",
    company: "Vertex",
    companyInitials: "VX",
    location: "Seattle, WA",
    remote: true,
    type: "Full-time",
    category: "Motion & 3D",
    salary: "$120k–$150k",
    postedDaysAgo: 13,
    tags: ["Cinema 4D", "Rendering", "Lighting"],
  },
];
