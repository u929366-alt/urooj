import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces plain HTML for PHP-era shared hosting (no Node.js
// on the server): no image optimizer, folder-per-page URLs, and the API
// routes are excluded by the build script. The default remains a
// self-contained Node build (cPanel Passenger, VPS); Vercel ignores both.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  trailingSlash: isStaticExport,
  images: isStaticExport ? { unoptimized: true } : undefined,
};

export default nextConfig;
