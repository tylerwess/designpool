import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

test("the role page uses tags under the title and an expandable description", () => {
  const page = readFileSync(join(ROOT, "app/jobs/[source]/[token]/[externalId]/page.tsx"), "utf8");
  assert.equal(page.includes("Characteristics"), false);
  assert.equal(page.includes("listingFacts"), false);
  assert.match(page, /ListingByline/);
  assert.match(page, /listingTags/);
  assert.match(page, /<Tag href=\{tag\.href\}>/);
  assert.match(page, /ExpandableDescription/);
  assert.match(page, /splitDescription/);
  assert.ok(page.indexOf("ListingByline") < page.indexOf("<h1"), "company byline should sit above the title");
  assert.ok(page.indexOf("<h1") < page.indexOf("<Tag"), "filter tags should sit below the title");

  const card = readFileSync(join(ROOT, "components/JobCard.tsx"), "utf8");
  assert.match(card, /ListingByline/);
  assert.ok(card.indexOf("ListingByline") < card.indexOf("<h2"), "job cards use the same byline-then-title order");

  const expand = readFileSync(join(ROOT, "components/ExpandableDescription.tsx"), "utf8");
  assert.match(expand, /aria-expanded=\{open\}/);
  assert.match(expand, /aria-controls=\{restId\}/);
  assert.match(expand, /Show less/);
  assert.match(expand, /Read more/);
  assert.match(expand, /hidden=\{!open\}/);
});
