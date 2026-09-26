import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseYears } from "../lib/years";

describe("parseYears", () => {
  it("reads 5+ years of experience", () => {
    assert.deepEqual(parseYears("5+ years of experience designing products"), { yearsMin: 5, yearsMax: null });
  });

  it("reads hyphen, en dash, and to ranges", () => {
    assert.deepEqual(parseYears("3-5 years in product design"), { yearsMin: 3, yearsMax: 5 });
    assert.deepEqual(parseYears("3–5 years"), { yearsMin: 3, yearsMax: 5 });
    assert.deepEqual(parseYears("3 to 5 years of experience"), { yearsMin: 3, yearsMax: 5 });
  });

  it("reads at least and minimum of", () => {
    assert.deepEqual(parseYears("at least 4 years"), { yearsMin: 4, yearsMax: null });
    assert.deepEqual(parseYears("minimum of 6 years experience"), { yearsMin: 6, yearsMax: null });
  });

  it("reads spelled-out numbers", () => {
    assert.deepEqual(parseYears("five years of experience"), { yearsMin: 5, yearsMax: null });
    assert.deepEqual(parseYears("three to five years"), { yearsMin: 3, yearsMax: 5 });
  });

  it("ignores runway, company age, and historical spans", () => {
    assert.deepEqual(parseYears("We have 5 years of runway left."), { yearsMin: null, yearsMax: null });
    assert.deepEqual(parseYears("The company is 10 years old."), { yearsMin: null, yearsMax: null });
    assert.deepEqual(parseYears("Founded 8 years ago in a garage."), { yearsMin: null, yearsMax: null });
    assert.deepEqual(
      parseYears("In the last 5 years we shipped a lot. Minimum of 3 years experience required."),
      { yearsMin: 3, yearsMax: null },
    );
  });

  it("prefers an experience requirement over an earlier unrelated number", () => {
    assert.deepEqual(
      parseYears("We're a 10 year old company. You have 4+ years of experience."),
      { yearsMin: 4, yearsMax: null },
    );
  });

  it("reads a possessive experience phrase and a bare plus", () => {
    assert.deepEqual(parseYears("5 years' experience with Figma"), { yearsMin: 5, yearsMax: null });
    assert.deepEqual(parseYears("Looking for someone with 7+ years."), { yearsMin: 7, yearsMax: null });
  });

  it("returns empty when no years are stated", () => {
    assert.deepEqual(parseYears("A strong portfolio and a point of view."), { yearsMin: null, yearsMax: null });
  });

  it("ignores age ranges and company history, and keeps over-N experience", () => {
    assert.deepEqual(parseYears("accounts for 16-17 year olds"), { yearsMin: null, yearsMax: null });
    assert.deepEqual(parseYears("For over 30 years we've been making games."), { yearsMin: null, yearsMax: null });
    assert.deepEqual(parseYears("over 5 years of experience"), { yearsMin: 5, yearsMax: null });
  });
});
