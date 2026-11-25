/**
 * Read cache for the public pages, so page views and crawlers don't keep Neon awake.
 *
 * Listings only change during the nightly pull (08:15–10:15 UTC), so reads are cached in
 * six-hour windows. The windows start at 11:00 UTC, after the last part has finished, which
 * means every page shows the new pull's results by about 3am Pacific.
 *
 * Two layers: a per-isolate memory map (also folds concurrent misses into one query) and,
 * on Cloudflare, the colo's Cache API, so new isolates in the same data center reuse the result.
 * A failed load is never cached.
 */

const HOUR_MS = 60 * 60 * 1000;
export const CACHE_WINDOW_MS = 6 * HOUR_MS;
/** Windows start at 11:00 UTC: after the 10:15 UTC part of the nightly pull. */
const WINDOW_ANCHOR_MS = 11 * HOUR_MS;
const CACHE_ORIGIN = "https://designpool.io/__data-cache/";

/** Index of the six-hour window `now` falls in. Changes at 11:00, 17:00, 23:00 and 05:00 UTC. */
export function cacheWindow(now = Date.now()): number {
  return Math.floor((now - WINDOW_ANCHOR_MS) / CACHE_WINDOW_MS);
}

/** Milliseconds left until the current window ends. */
export function msUntilWindowEnds(now = Date.now()): number {
  const end = (cacheWindow(now) + 1) * CACHE_WINDOW_MS + WINDOW_ANCHOR_MS;
  return end - now;
}

type Entry = { window: number; value: Promise<unknown> };
const memory = new Map<string, Entry>();

type EdgeCache = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};

function edgeCache(): EdgeCache | null {
  const caches = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return caches?.default ?? null;
}

async function loadThroughEdge<T>(key: string, window: number, now: number, loader: () => Promise<T>): Promise<T> {
  const cache = edgeCache();
  if (!cache) return loader();
  const request = new Request(`${CACHE_ORIGIN}${encodeURIComponent(key)}?w=${window}`);
  try {
    const hit = await cache.match(request);
    if (hit) return (await hit.json()) as T;
  } catch (error) {
    console.error("[data-cache] read failed", error);
  }
  const value = await loader();
  try {
    const seconds = Math.max(60, Math.floor(msUntilWindowEnds(now) / 1000));
    await cache.put(
      request,
      new Response(JSON.stringify(value), {
        headers: { "content-type": "application/json", "cache-control": `public, max-age=${seconds}` },
      }),
    );
  } catch (error) {
    console.error("[data-cache] write failed", error);
  }
  return value;
}

/** Returns the cached value for `key` in the current window, calling `loader` at most once per window. */
export function cachedRead<T>(key: string, loader: () => Promise<T>, now = Date.now()): Promise<T> {
  const window = cacheWindow(now);
  const existing = memory.get(key);
  if (existing && existing.window === window) return existing.value as Promise<T>;
  const value = loadThroughEdge(key, window, now, loader);
  memory.set(key, { window, value });
  value.catch(() => {
    if (memory.get(key)?.value === value) memory.delete(key);
  });
  return value;
}

/** Test helper. */
export function clearMemoryCache(): void {
  memory.clear();
}
