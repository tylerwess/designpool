import assert from "node:assert/strict";
import test from "node:test";
import { companies } from "../data/companies";
import { companyDomain, companyInitial, companyLogoSrc, companyWebsite } from "../lib/company-logo";

test("companyInitial uses the first letter", () => {
  assert.equal(companyInitial("Figma"), "F");
  assert.equal(companyInitial(" one medical"), "O");
  assert.equal(companyInitial("   "), "?");
});

test("companyDomain reads the host from the stored website", () => {
  assert.equal(companyDomain("https://www.figma.com"), "figma.com");
  assert.equal(companyDomain("https://webflow.com/careers"), "webflow.com");
  assert.equal(companyDomain("not a url"), null);
  assert.equal(companyDomain(null), null);
});

test("companyLogoSrc points at Google's favicon service", () => {
  assert.equal(
    companyLogoSrc("https://www.figma.com"),
    "https://www.google.com/s2/favicons?sz=128&domain=figma.com",
  );
  assert.equal(companyLogoSrc(null), null);
});

test("every seeded company has a website that yields a logo URL", () => {
  for (const company of companies) {
    assert.ok(company.website, `${company.name} is missing a website`);
    assert.ok(companyLogoSrc(company.website), `${company.name} did not produce a logo URL`);
    assert.equal(companyWebsite(company.ats, company.token), company.website);
  }
});
