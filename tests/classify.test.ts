import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyRole } from "../lib/classify";

function level(title: string, description = "", sizeBucket = "1000+", yearsMin: number | null = null) {
  return classifyRole({ title, description, sizeBucket, yearsMin });
}

describe("classifyRole", () => {
  it("maps plain product and UX titles to mid-senior", () => {
    assert.equal(level("Product Designer").seniority, "mid");
    assert.equal(level("UX Designer").seniority, "mid");
    assert.equal(level("Product Designer II").seniority, "mid");
    assert.equal(level("Brand Designer").seniority, "mid");
  });

  it("maps the nine title bands", () => {
    assert.equal(level("New Grad Product Designer").seniority, "new_grad");
    assert.equal(level("2026 New Grad, Product Design").seniority, "new_grad");
    assert.equal(level("Early Career Designer").seniority, "new_grad");
    assert.equal(level("Design Intern").seniority, "new_grad");
    assert.equal(level("Associate Product Designer").seniority, "entry");
    assert.equal(level("Junior Visual Designer").seniority, "entry");
    assert.equal(level("Designer I").seniority, "entry");
    assert.equal(level("Apprentice Designer").seniority, "entry");
    assert.equal(level("Senior Product Designer").seniority, "senior");
    assert.equal(level("Sr. Product Designer").seniority, "senior");
    assert.equal(level("Product Designer III").seniority, "senior");
    assert.equal(level("Staff Product Designer").seniority, "staff");
    assert.equal(level("Principal Product Designer").seniority, "principal");
    assert.equal(level("Distinguished Designer").seniority, "principal");
    assert.equal(level("Design Manager").seniority, "manager");
    assert.equal(level("Director of Product Design").seniority, "director");
    assert.equal(level("Senior Director, Design").seniority, "director");
    assert.equal(level("VP of Design").seniority, "executive");
    assert.equal(level("Chief Design Officer").seniority, "executive");
  });

  it("treats Lead as staff unless the description mentions people management", () => {
    assert.equal(level("Lead Product Designer", "You will design the core product.").seniority, "staff");
    assert.equal(level("Lead Product Designer", "We hire the best designers in the world.").seniority, "staff");
    assert.equal(level("Lead Product Designer", "This role has direct reports.").seniority, "manager");
    assert.equal(level("Lead Product Designer", "You will grow a team of designers.").seniority, "manager");
    assert.equal(level("Lead Product Designer", "You manage a team of designers.").seniority, "manager");
    assert.equal(level("Lead Product Designer", "You will hire the next designers on the team.").seniority, "manager");
  });

  it("uses company size for Head of Design", () => {
    assert.equal(level("Head of Design", "", "1-50").seniority, "executive");
    assert.equal(level("Head of Design", "", "51-200").seniority, "executive");
    assert.equal(level("Head of Design", "", "201-1000").seniority, "director");
    assert.equal(level("Head of Design", "", "1000+").seniority, "director");
  });

  it("keeps the title level and marks stretch when years are below the band", () => {
    const stretch = level("Senior Product Designer", "3+ years of experience", "1000+", 3);
    assert.equal(stretch.seniority, "senior");
    assert.equal(stretch.stretch, true);

    const fit = level("Senior Product Designer", "6+ years of experience", "1000+", 6);
    assert.equal(fit.seniority, "senior");
    assert.equal(fit.stretch, false);

    const unstated = level("Senior Product Designer");
    assert.equal(unstated.stretch, false);

    const higherYears = level("Product Designer", "8+ years", "1000+", 8);
    assert.equal(higherYears.seniority, "mid");
    assert.equal(higherYears.stretch, false);
  });
});
