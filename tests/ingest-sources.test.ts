import assert from "node:assert/strict";
import test from "node:test";
import { companies } from "../data/companies";
import { companiesForIngest, parseIngestSources } from "../lib/ingest-sources";

test("an unset INGEST_SOURCES value fetches every seeded board", () => {
  assert.deepEqual(parseIngestSources(undefined), ["greenhouse", "ashby", "lever"]);
  assert.deepEqual(parseIngestSources("   "), ["greenhouse", "ashby", "lever"]);
  const selected = companiesForIngest(companies, undefined);
  assert.equal(selected.length, companies.length);
  assert.ok(companies.some((company) => company.ats === "ashby"));
  assert.ok(companies.some((company) => company.ats === "lever"));
  assert.ok(selected.some((company) => company.ats === "ashby"));
  assert.ok(selected.some((company) => company.ats === "lever"));
});

test("INGEST_SOURCES accepts a comma-separated list and ignores duplicates", () => {
  assert.deepEqual(parseIngestSources("greenhouse, ashby, greenhouse"), ["greenhouse", "ashby"]);
  const selected = companiesForIngest(companies, "Lever");
  assert.ok(selected.length > 0);
  assert.ok(selected.every((company) => company.ats === "lever"));
});

test("an unknown INGEST_SOURCES value is rejected", () => {
  assert.throws(() => parseIngestSources("greenhouse,workday"), /unknown values: workday/);
});

test("the default company list used by ingest includes every board", () => {
  const previous = process.env.INGEST_SOURCES;
  delete process.env.INGEST_SOURCES;
  try {
    const selected = companiesForIngest();
    assert.deepEqual(
      new Set(selected.map((company) => company.ats)),
      new Set(["greenhouse", "ashby", "lever"]),
    );
    assert.equal(selected.length, companies.length);
  } finally {
    if (previous === undefined) delete process.env.INGEST_SOURCES;
    else process.env.INGEST_SOURCES = previous;
  }
});

test("cron parts split the company list with no gaps or overlap", async () => {
  const { companiesForPart, parseIngestPart } = await import("../lib/ingest-sources");
  const { companies } = await import("../data/companies");
  const seen = new Map<string, number>();
  for (let part = 1; part <= 3; part += 1) {
    const slice = companiesForPart(companies, { part, parts: 3 });
    assert.ok(slice.length <= Math.ceil(companies.length / 3));
    for (const company of slice) {
      const key = `${company.ats}:${company.token}`;
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
  }
  assert.equal(seen.size, new Set(companies.map((c) => `${c.ats}:${c.token}`)).size);
  assert.ok([...seen.values()].every((count) => count === 1));

  assert.equal(parseIngestPart(new URLSearchParams("")), null);
  assert.deepEqual(parseIngestPart(new URLSearchParams("part=2&parts=3")), { part: 2, parts: 3 });
  for (const bad of ["part=0&parts=3", "part=4&parts=3", "part=1", "parts=3", "part=a&parts=3", "part=1.5&parts=3"]) {
    assert.equal(typeof parseIngestPart(new URLSearchParams(bad)), "string", bad);
  }
});
