import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 produces plain HTML for PHP-era shared hosting (no Node.js
// on the server): no image optimizer, folder-per-page URLs, and the API
// routes are excluded by the build script. The default remains a
// self-contained Node build (cPanel Passenger, VPS); Vercel ignores both.
//
// NOTE: the learning portal (/learn, /admin, /cms-api) needs a Node.js server
// and a database, so it cannot be part of a STATIC_EXPORT build. Exporting
// still works for the marketing pages, but the portal must be served from a
// Node host. See README "Learning portal".
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  trailingSlash: isStaticExport,
  images: isStaticExport ? { unoptimized: true } : undefined,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
