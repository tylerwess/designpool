import assert from "node:assert/strict";
import test from "node:test";
import { employmentFrom } from "../lib/text";

test("employmentFrom only flags a whole 'intern' word, not internal/international", () => {
  assert.equal(employmentFrom("Internship", "Product Design Intern"), "internship");
  assert.equal(employmentFrom(null, "Summer Internship, Product Design"), "internship");
  assert.equal(employmentFrom("Are you an intern candidate?", "Product Designer"), "internship");

  assert.equal(
    employmentFrom("Willing to work internationally: yes", "Principal Creative Director, Growth Marketing"),
    "full_time",
  );
  assert.equal(employmentFrom("Internal referral source", "Staff Product Designer"), "full_time");
  assert.equal(employmentFrom(null, "International Product Designer"), "full_time");
});

test("employmentFrom still catches contract and part-time roles", () => {
  assert.equal(employmentFrom("Contract", "Senior Designer"), "contract");
  assert.equal(employmentFrom(null, "Senior Designer - Freelance"), "contract");
  assert.equal(employmentFrom("Part-time", "Product Designer"), "contract");
  assert.equal(employmentFrom(null, "Senior Product Designer"), "full_time");
});
