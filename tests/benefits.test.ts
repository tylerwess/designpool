import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { benefitsFor } from "../lib/text";
import { applyFilters, parseSearchParams } from "../lib/filters";
import { BENEFITS, isBenefit } from "../lib/taxonomy";
import type { Listing } from "../lib/types";

describe("benefitsFor", () => {
  it("detects each benefit from realistic description phrasing", () => {
    assert.deepEqual(
      new Set(benefitsFor("We offer equity, a 401(k) with company match, and stock options (RSUs).")),
      new Set(["equity", "401k_match", "stock_options"]),
    );
    assert.deepEqual(new Set(benefitsFor("Unlimited PTO and flexible time off.")), new Set(["pto"]));
    assert.deepEqual(new Set(benefitsFor("We sponsor visas, including H-1B and OPT sponsorship.")), new Set(["visa_sponsorship"]));
    assert.deepEqual(new Set(benefitsFor("A wellness stipend and mental health support.")), new Set(["wellness"]));
    assert.deepEqual(new Set(benefitsFor("Free lunch and stocked kitchen every day onsite.")), new Set(["free_meals"]));
  });

  it("returns an empty list when nothing matches", () => {
    assert.deepEqual(benefitsFor("We build design tools for teams that ship weekly."), []);
  });

  it("does not false-positive on unrelated words", () => {
    assert.deepEqual(benefitsFor("This is an internal tool for our international team."), []);
  });

  it("every BENEFITS id is recognized by isBenefit", () => {
    for (const benefit of BENEFITS) assert.equal(isBenefit(benefit.id), true);
    assert.equal(isBenefit("not_a_benefit"), false);
  });
});

function job(overrides: Partial<Listing> = {}): Listing {
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
    benefits: [],
    ...overrides,
  };
}

describe("benefits filter", () => {
  it("parses the benefits search param", () => {
    const filters = parseSearchParams({ benefits: ["visa_sponsorship", "pto"] });
    assert.deepEqual(filters.benefits, ["visa_sponsorship", "pto"]);
  });

  it("keeps roles that have at least one selected benefit", () => {
    const listings = [
      job({ id: "a", benefits: ["visa_sponsorship"] }),
      job({ id: "b", benefits: ["equity"] }),
      job({ id: "c", benefits: [] }),
    ];
    const filters = parseSearchParams({ benefits: ["visa_sponsorship"] });
    const result = applyFilters(listings, filters).map((listing) => listing.id);
    assert.deepEqual(result, ["a"]);
  });

  it("matches on any selected benefit, not all", () => {
    const listings = [job({ id: "a", benefits: ["pto"] }), job({ id: "b", benefits: ["wellness"] })];
    const filters = parseSearchParams({ benefits: ["pto", "wellness"] });
    const result = applyFilters(listings, filters).map((listing) => listing.id);
    assert.deepEqual(new Set(result), new Set(["a", "b"]));
  });
});
