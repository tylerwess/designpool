import assert from "node:assert/strict";
import test from "node:test";
import { workAuthFrom } from "../lib/work-auth";

test("visa sponsorship counts only when a sentence offers it", () => {
  assert.equal(workAuthFrom("<p>Visa sponsorship: We do sponsor visas! However, we aren't able to sponsor every role.</p>").sponsorsVisa, true);
  assert.equal(workAuthFrom("We can sponsor your visa.").sponsorsVisa, true);
  assert.equal(
    workAuthFrom("The Company may not be able to employ candidates on certain visa categories, or support future H-1B sponsorship.").sponsorsVisa,
    false,
  );
  assert.equal(workAuthFrom("Eligible for company-sponsored medical benefits.").sponsorsVisa, false);
  assert.equal(
    workAuthFrom("<p>The Company may not be able to employ candidates on certain U.S.<br>visa categories, or support future H-1B sponsorship.</p>").sponsorsVisa,
    false,
  );
});

test("OPT matches the acronym or its full name, not the verb opt", () => {
  assert.equal(workAuthFrom("Candidates on STEM OPT are welcome to apply.").opt, true);
  assert.equal(workAuthFrom("We support Optional Practical Training.").opt, true);
  assert.equal(workAuthFrom("In some cases, we may opt to do paid, trial work.").opt, false);
  assert.equal(workAuthFrom("We are unable to hire candidates on OPT.").opt, false);
});

test("relocation counts unless the sentence rules it out", () => {
  assert.equal(workAuthFrom("We'll help you relocate to the UK.").relocation, true);
  assert.equal(workAuthFrom("Relocation assistance is available.").relocation, true);
  assert.equal(workAuthFrom("RELOCATION? YES! Our mobility team will support your move.").relocation, true);
  assert.equal(workAuthFrom("Relocation assistance is not provided.").relocation, false);
  assert.equal(workAuthFrom("Based in or willing to relocate to London.").relocation, false);
  assert.deepEqual(workAuthFrom(null), { opt: false, relocation: false, sponsorsVisa: false });
});
