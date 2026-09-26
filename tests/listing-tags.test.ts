import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingTags, postedWindowFor } from "../lib/listing-tags";
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
    ...overrides,
  };
}

describe("listingTags", () => {
  const now = Date.parse("2026-09-22T12:00:00.000Z");

  it("uses filter-chip labels and links each tag to /jobs", () => {
    const tags = listingTags(job(), now);
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
    assert.equal(byKey["location:San Francisco, CA"]?.label, "San Francisco, CA");
    assert.equal(byKey["employment:full_time"]?.label, "Full-time");
    assert.equal(byKey["size:1000+"]?.label, "1000+");
    assert.equal(byKey.salary?.label, "Has salary");
    assert.equal(byKey.salary?.href, "/jobs?salary=1");
    assert.equal(byKey["posted:3d"]?.label, "Past 3 days");
    assert.equal(byKey["posted:3d"]?.href, "/jobs?posted=3d");
    assert.equal(
      tags.some((tag) => /stretch|not stated|not listed/i.test(tag.label)),
      false,
    );
  });

  it("omits unknown years, work type, location, salary, and stale posted age", () => {
    const tags = listingTags(
      job({
        yearsMin: null,
        yearsMax: null,
        remoteType: "unknown",
        location: null,
        salaryMin: null,
        salaryMax: null,
        postedAt: "2026-07-01T12:00:00.000Z",
        firstSeenAt: "2026-07-01T12:00:00.000Z",
        disciplines: [],
      }),
      now,
    );
    const keys = tags.map((tag) => tag.key);
    assert.equal(
      keys.some((key) => key.startsWith("years:") || key.startsWith("work:") || key.startsWith("location:") || key === "salary" || key.startsWith("posted:")),
      false,
    );
    assert.ok(keys.includes("seniority:senior"));
    assert.ok(keys.includes("employment:full_time"));
  });

  it("splits multiple locations and matches years chip vocabulary", () => {
    const tags = listingTags(
      job({
        location: "New York / London",
        yearsMin: 3,
        yearsMax: 5,
        salaryMin: null,
        salaryMax: null,
      }),
      now,
    );
    assert.ok(tags.some((tag) => tag.label === "3–5 yrs" && tag.href === "/jobs?yearsMin=3&yearsMax=5"));
    assert.ok(tags.some((tag) => tag.label === "New York" && tag.href === "/jobs?location=New+York"));
    assert.ok(tags.some((tag) => tag.label === "London" && tag.href === "/jobs?location=London"));
    assert.ok(
      listingTags(job({ yearsMin: null, yearsMax: 4 }), now).some(
        (tag) => tag.label === "Up to 4 yrs" && tag.href === "/jobs?yearsMax=4",
      ),
    );
  });
});

describe("postedWindowFor", () => {
  const now = Date.parse("2026-09-26T12:00:00.000Z");

  it("picks the tightest window that still contains the listing", () => {
    assert.equal(postedWindowFor(job({ postedAt: "2026-09-26T01:00:00.000Z" }), now)?.id, "24h");
    assert.equal(postedWindowFor(job({ postedAt: "2026-09-24T12:00:00.000Z" }), now)?.id, "3d");
    assert.equal(postedWindowFor(job({ postedAt: "2026-09-20T12:00:00.000Z" }), now)?.id, "7d");
    assert.equal(postedWindowFor(job({ postedAt: "2026-09-14T12:00:00.000Z" }), now)?.id, "14d");
    assert.equal(postedWindowFor(job({ postedAt: "2026-09-01T12:00:00.000Z" }), now)?.id, "30d");
    assert.equal(postedWindowFor(job({ postedAt: "2026-08-01T12:00:00.000Z" }), now), null);
  });
});
