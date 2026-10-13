import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Data pages are `force-dynamic` and read Neon on each request. The few prerendered routes
// (/about, icons, Open Graph image) never revalidate, so they are served from the build's static assets.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
