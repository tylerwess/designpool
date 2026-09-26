import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingByline } from "../lib/format";
import { listingTags } from "../lib/listing-tags";
import type { Listing } from "../lib/types";

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
    postedAt: "2026-09-20T12:00:00.000Z",
    sourceUpdatedAt: null,
    firstSeenAt: "2026-09-20T12:00:00.000Z",
    lastSeenAt: "2026-09-20T12:00:00.000Z",
    seniority: "senior",
    stretch: true,
    yearsMin: 5,
    yearsMax: null,
    industry: "productivity",
    sizeBucket: "1000+",
    disciplines: ["product_design"],
    benefits: [],
    ...overrides,
  };
}

describe("listingTags", () => {
  it("uses filter-chip labels and links each tag to /jobs", () => {
    const tags = listingTags(job());
    const byKey = Object.fromEntries(tags.map((tag) => [tag.key, tag]));

    assert.equal(byKey["seniority:senior"]?.label, "Senior");
    assert.equal(byKey["seniority:senior"]?.href, "/jobs?seniority=senior");
    assert.equal(byKey["years:5+ yrs"]?.label, "5+ yrs");
    assert.equal(byKey["years:5+ yrs"]?.href, "/jobs?yearsMin=5");
    assert.equal(byKey["industry:productivity"]?.label, "Productivity");
    assert.equal(byKey["industry:productivity"]?.href, "/jobs?industry=productivity");
    assert.equal(byKey["discipline:product_design"]?.label, "Product design");
    assert.equal(byKey["work:remote"]?.label, "Remote");
    assert.equal(byKey["work:remote"]?.href, "/jobs?work=remote");
    assert.equal(byKey["employment:full_time"]?.label, "Full-time");
    assert.equal(byKey["size:1000+"]?.label, "1000+");
    assert.equal(byKey.salary?.label, "Has salary");
    assert.equal(byKey.salary?.href, "/jobs?salary=1");
    assert.equal(
      tags.some((tag) => /stretch|not stated|not listed|past |san francisco/i.test(tag.label)),
      false,
    );
    assert.equal(
      tags.some((tag) => tag.key.startsWith("location:") || tag.key.startsWith("posted:")),
      false,
    );
  });

  it("omits unknown years, work type, and salary", () => {
    const tags = listingTags(
      job({
        yearsMin: null,
        yearsMax: null,
        remoteType: "unknown",
        salaryMin: null,
        salaryMax: null,
        disciplines: [],
      }),
    );
    const keys = tags.map((tag) => tag.key);
    assert.equal(
      keys.some((key) => key.startsWith("years:") || key.startsWith("work:") || key === "salary"),
      false,
    );
    assert.ok(keys.includes("seniority:senior"));
    assert.ok(keys.includes("employment:full_time"));
  });

  it("matches years chip vocabulary", () => {
    assert.ok(listingTags(job({ yearsMin: 3, yearsMax: 5 })).some((tag) => tag.label === "3–5 yrs" && tag.href === "/jobs?yearsMin=3&yearsMax=5"));
    assert.ok(listingTags(job({ yearsMin: null, yearsMax: 4 })).some((tag) => tag.label === "Up to 4 yrs" && tag.href === "/jobs?yearsMax=4"));
  });
});

describe("listingByline", () => {
  const now = Date.parse("2026-09-23T12:00:00.000Z");

  it("puts company, location, and posted age on one line", () => {
    assert.equal(listingByline(job(), now), "Figma · San Francisco, CA · Posted 3d ago");
    assert.equal(
      listingByline(job({ location: null }), now),
      "Figma · Posted 3d ago",
    );
  });
});
