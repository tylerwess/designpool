import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { JOBS_PAGE_SIZE, clampPage, emptyFilters, pageHref } from "../lib/filters";

const ROOT = process.cwd();

test("JOBS_PAGE_SIZE caps a page at 12 roles", () => {
  assert.equal(JOBS_PAGE_SIZE, 12);
});

test("clampPage keeps the page within [1, totalPages]", () => {
  assert.equal(clampPage(0, 5), 1);
  assert.equal(clampPage(-3, 5), 1);
  assert.equal(clampPage(NaN, 5), 1);
  assert.equal(clampPage(3, 5), 3);
  assert.equal(clampPage(3.9, 5), 3);
  assert.equal(clampPage(99, 5), 5);
  assert.equal(clampPage(1, 0), 1);
});

test("pageHref omits page=1 but keeps other pages and existing filters", () => {
  assert.equal(pageHref(emptyFilters(), 1), "/jobs");
  assert.equal(pageHref(emptyFilters(), 2), "/jobs?page=2");
  const filters = { ...emptyFilters(), q: "designer" };
  assert.equal(pageHref(filters, 3), "/jobs?q=designer&page=3");
});

test("the jobs page paginates and links a Pagination nav", () => {
  const page = readFileSync(join(ROOT, "app/jobs/page.tsx"), "utf8");
  assert.match(page, /Pagination/);
  assert.match(page, /JOBS_PAGE_SIZE/);
  assert.match(page, /clampPage/);
  const pagination = readFileSync(join(ROOT, "components/Pagination.tsx"), "utf8");
  assert.match(pagination, /aria-label="Pagination"/);
  assert.match(pagination, /aria-current/);
});
