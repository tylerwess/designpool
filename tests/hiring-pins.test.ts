import assert from "node:assert/strict";
import test from "node:test";
import { hiringPins } from "../lib/hiring-pins";
import type { Ats } from "../lib/taxonomy";

const job = (company: string, source: Ats, companyToken: string) => ({ company, source, companyToken });

test("hiring pins group roles by company, most roles first, with each company's website", () => {
  const jobs = [
    job("Notion", "ashby", "notion"),
    job("Figma", "greenhouse", "figma"),
    job("Notion", "ashby", "notion"),
    job("Unknown Co", "lever", "nope"),
    job("Figma", "greenhouse", "figma"),
    job("Notion", "ashby", "notion"),
  ];
  assert.deepEqual(hiringPins(jobs), [
    { company: "Notion", website: "https://www.notion.com", roles: 3 },
    { company: "Figma", website: "https://www.figma.com", roles: 2 },
    { company: "Unknown Co", website: null, roles: 1 },
  ]);
  assert.equal(hiringPins(jobs, 2).length, 2);
  assert.deepEqual(hiringPins([]), []);
});
