import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/**" },
      { protocol: "https", hostname: "*.gstatic.com" },
    ],
  },
};

export default nextConfig;
