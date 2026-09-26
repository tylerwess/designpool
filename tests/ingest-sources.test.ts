import assert from "node:assert/strict";
import test from "node:test";
import { companies } from "../data/companies";
import { companiesForIngest, parseIngestSources } from "../lib/ingest-sources";

test("an unset INGEST_SOURCES value fetches Greenhouse only", () => {
  assert.deepEqual(parseIngestSources(undefined), ["greenhouse"]);
  assert.deepEqual(parseIngestSources("   "), ["greenhouse"]);
  const selected = companiesForIngest(companies, undefined);
  assert.equal(selected.length, companies.filter((company) => company.ats === "greenhouse").length);
  assert.ok(selected.every((company) => company.ats === "greenhouse"));
  assert.ok(selected.length > 0);
  assert.ok(companies.some((company) => company.ats === "ashby"));
  assert.ok(companies.some((company) => company.ats === "lever"));
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

test("the default company list used by ingest leaves Ashby and Lever out", () => {
  const previous = process.env.INGEST_SOURCES;
  delete process.env.INGEST_SOURCES;
  try {
    const selected = companiesForIngest();
    assert.deepEqual([...new Set(selected.map((company) => company.ats))], ["greenhouse"]);
  } finally {
    if (previous === undefined) delete process.env.INGEST_SOURCES;
    else process.env.INGEST_SOURCES = previous;
  }
});
