import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { looksLikeHtml, sanitizeDescriptionHtml, splitDescription } from "../lib/description";

describe("splitDescription", () => {
  it("shows the first plain-text paragraph and keeps the rest", () => {
    assert.deepEqual(splitDescription("First paragraph.\n\nSecond paragraph.\n\nThird."), {
      preview: "First paragraph.",
      rest: "Second paragraph.\n\nThird.",
    });
  });

  it("has no rest when there is only one paragraph", () => {
    assert.deepEqual(splitDescription("Just one block of copy."), {
      preview: "Just one block of copy.",
      rest: "",
    });
  });

  it("splits sanitized HTML on block tags and drops scripts", () => {
    const raw =
      "<p>We design the product.</p><script>alert(1)</script><p>You will ship weekly.</p><p>Apply below.</p>";
    assert.equal(looksLikeHtml(raw), true);
    assert.equal(sanitizeDescriptionHtml(raw).includes("alert"), false);
    assert.deepEqual(splitDescription(raw), {
      preview: "We design the product.",
      rest: "You will ship weekly.\n\nApply below.",
    });
  });

  it("treats a double break in HTML as a paragraph split", () => {
    assert.deepEqual(splitDescription("<div>Intro copy.<br><br>The rest of the role.</div>"), {
      preview: "Intro copy.",
      rest: "The rest of the role.",
    });
  });

  it("returns empty parts when there is no description", () => {
    assert.deepEqual(splitDescription(null), { preview: "", rest: "" });
    assert.deepEqual(splitDescription("   "), { preview: "", rest: "" });
  });
});
