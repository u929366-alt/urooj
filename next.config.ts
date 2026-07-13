import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained production build for Node.js hosting (cPanel Passenger).
  // Vercel and plain `next start` are unaffected by this setting.
  output: "standalone",
};

export default nextConfig;
