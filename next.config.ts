import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres"],
  images: {
    // Company logos are small Google favicons fetched at their final size, so they skip
    // Next's optimizer. That keeps the Worker free of a Cloudflare Images binding.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/**" },
      { protocol: "https", hostname: "*.gstatic.com" },
    ],
  },
};

export default nextConfig;

// Lets `next dev` read Cloudflare bindings and .dev.vars.
initOpenNextCloudflareForDev();
