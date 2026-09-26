import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { looksLikeHtml, sanitizeDescriptionHtml, toDescriptionHtml } from "../lib/description";

describe("toDescriptionHtml", () => {
  it("keeps a heading and the body that follows it", () => {
    const html = toDescriptionHtml("About the Role\n\nWe design the product for teams who ship weekly.");
    assert.match(html, /About the Role/);
    assert.match(html, /We design the product/);
    assert.equal(html.includes("<p>"), true);
  });

  it("turns plain paragraphs into sanitized markup", () => {
    const html = toDescriptionHtml("First paragraph.\n\nSecond paragraph.");
    assert.equal(html, "<p>First paragraph.</p><p>Second paragraph.</p>");
  });

  it("sanitizes HTML and keeps later body after a heading", () => {
    const raw =
      "<h2>About the Role</h2><script>alert(1)</script><p>You will ship weekly with the brand team.</p><p>Apply below.</p>";
    assert.equal(looksLikeHtml(raw), true);
    const html = sanitizeDescriptionHtml(raw);
    assert.equal(html.includes("alert"), false);
    assert.equal(html.includes("<script"), false);
    assert.match(html, /About the Role/);
    assert.match(html, /You will ship weekly/);
    assert.equal(toDescriptionHtml(raw), html);
  });

  it("drops event handlers and keeps safe links", () => {
    const html = sanitizeDescriptionHtml(
      `<p onclick="steal()">Hi</p><a href="https://example.com/jobs">Jobs</a><a href="javascript:alert(1)">Nope</a>`,
    );
    assert.equal(html.includes("onclick"), false);
    assert.equal(html.includes("javascript:"), false);
    assert.match(html, /href="https:\/\/example.com\/jobs"/);
  });

  it("returns empty markup when there is no description", () => {
    assert.equal(toDescriptionHtml(null), "");
    assert.equal(toDescriptionHtml("   "), "");
  });
});
