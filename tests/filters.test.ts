import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { companies } from "../data/companies";
import { isDesignRole } from "../lib/design-role";
import { applyFilters, parseSearchParams } from "../lib/filters";
import { INDUSTRIES } from "../lib/taxonomy";
import type { Listing } from "../lib/types";

function job(overrides: Partial<Listing>): Listing {
  return {
    id: "greenhouse:figma:1",
    source: "greenhouse",
    externalId: "1",
    company: "Figma",
    companyToken: "figma",
    title: "Senior Product Designer",
    url: "https://example.com",
    location: "San Francisco, CA",
    remoteType: "remote",
    employmentType: "full_time",
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    salaryInterval: "year",
    postedAt: new Date().toISOString(),
    sourceUpdatedAt: null,
    firstSeenAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    seniority: "senior",
    stretch: true,
    yearsMin: 3,
    yearsMax: null,
    industry: "productivity",
    sizeBucket: "1000+",
    disciplines: ["product_design"],
    ...overrides,
  };
}

describe("filters", () => {
  const listings = [
    job({ id: "a", yearsMin: 3, seniority: "senior", stretch: true }),
    job({
      id: "b",
      title: "Senior Product Designer",
      yearsMin: 8,
      stretch: false,
      company: "Stripe",
      industry: "fintech",
      remoteType: "hybrid",
      location: "New York, NY",
      salaryMin: null,
      salaryMax: null,
    }),
    job({
      id: "c",
      title: "Product Designer",
      seniority: "mid",
      yearsMin: null,
      yearsMax: null,
      stretch: false,
      remoteType: "onsite",
      employmentType: "internship",
      salaryMin: null,
      salaryMax: null,
      disciplines: ["ux"],
      sizeBucket: "51-200",
      company: "Linear",
    }),
  ];

  it("finds senior roles asking for 5 years or fewer and can hide unstated years", () => {
    const filters = parseSearchParams({
      seniority: "senior",
      yearsMax: "5",
      includeUnknownYears: "0",
    });
    const matched = applyFilters(listings, filters).map((listing) => listing.id);
    assert.deepEqual(matched, ["a"]);
  });

  it("filters industry, work type, salary, discipline, and keyword", () => {
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ industry: "fintech" })).map((listing) => listing.id),
      ["b"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ work: "remote" })).map((listing) => listing.id),
      ["a"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ salary: "1" })).map((listing) => listing.id),
      ["a"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ discipline: "ux" })).map((listing) => listing.id),
      ["c"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ q: "linear" })).map((listing) => listing.id),
      ["c"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ location: "new york" })).map((listing) => listing.id),
      ["b"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ employment: "internship" })).map((listing) => listing.id),
      ["c"],
    );
    assert.deepEqual(
      applyFilters(listings, parseSearchParams({ size: "51-200" })).map((listing) => listing.id),
      ["c"],
    );
  });
});

describe("company list and design filter", () => {
  it("includes more than 50 companies across the industry list", () => {
    assert.ok(companies.length >= 50);
    const industries = new Set(companies.map((company) => company.industry));
    for (const industry of INDUSTRIES) assert.ok(industries.has(industry.id), industry.id);
    const tokens = companies.map((company) => `${company.ats}:${company.token}`);
    assert.equal(new Set(tokens).size, tokens.length);
  });

  it("keeps design roles and drops engineering senses of design", () => {
    assert.equal(isDesignRole("Senior Product Designer"), true);
    assert.equal(isDesignRole("Design Engineer"), true);
    assert.equal(isDesignRole("UX Researcher"), true);
    assert.equal(isDesignRole("Head of Design"), true);
    assert.equal(isDesignRole("Mechanical Design Engineer"), false);
    assert.equal(isDesignRole("Hardware Design Engineer"), false);
    assert.equal(isDesignRole("ASIC Design Engineer"), false);
    assert.equal(isDesignRole("Circuit Design Engineer"), false);
    assert.equal(isDesignRole("Software Engineer"), false);
    assert.equal(isDesignRole("Quantitative Researcher"), false);
    assert.equal(isDesignRole("Learning Experience Designer"), false);
    assert.equal(isDesignRole("Design Engineer"), true);
    assert.equal(isDesignRole("Senior RF Design Engineer"), false);
    assert.equal(isDesignRole("Staff Electrical Systems Design Engineer"), false);
    assert.equal(isDesignRole("Software Engineer, Discovery UX"), false);
    assert.equal(isDesignRole("UI Programmer Intern"), false);
    assert.equal(isDesignRole("Staff Engineer, UI"), false);
  });
});
