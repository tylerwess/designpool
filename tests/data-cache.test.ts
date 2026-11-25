import assert from "node:assert/strict";
import test from "node:test";
import { cachedRead, cacheWindow, clearMemoryCache, msUntilWindowEnds } from "../lib/data-cache";
import { isExpired } from "../lib/ingest";

test("cache windows roll over at 11:00 UTC, after the nightly pull", () => {
  const before = Date.parse("2026-11-25T10:59:00Z");
  const after = Date.parse("2026-11-25T11:00:00Z");
  assert.notEqual(cacheWindow(before), cacheWindow(after));
  assert.equal(cacheWindow(after), cacheWindow(Date.parse("2026-11-25T16:59:00Z")));
  assert.equal(msUntilWindowEnds(Date.parse("2026-11-25T16:00:00Z")), 60 * 60 * 1000);
});

test("a window loads once, the next window loads again, and failures are not cached", async () => {
  clearMemoryCache();
  let calls = 0;
  const loader = async () => ++calls;
  const t = Date.parse("2026-11-25T12:00:00Z");
  assert.equal(await cachedRead("k", loader, t), 1);
  assert.equal(await cachedRead("k", loader, t + 60_000), 1);
  assert.equal(await cachedRead("k", loader, t + 6 * 60 * 60 * 1000), 2);

  let fail = true;
  const flaky = async () => {
    if (fail) throw new Error("down");
    return "ok";
  };
  await assert.rejects(cachedRead("f", flaky, t));
  fail = false;
  assert.equal(await cachedRead("f", flaky, t), "ok");
});

test("ingest skips postings already outside the 30-day window", () => {
  const cutoff = "2026-10-26T00:00:00.000Z";
  assert.equal(isExpired({ postedAt: "2026-09-01T00:00:00.000Z", firstSeenAt: "2026-11-25T00:00:00.000Z" }, cutoff), true);
  assert.equal(isExpired({ postedAt: "2026-11-20T00:00:00.000Z", firstSeenAt: "2026-11-25T00:00:00.000Z" }, cutoff), false);
  assert.equal(isExpired({ postedAt: null, firstSeenAt: "2026-11-25T00:00:00.000Z" }, cutoff), false);
});
