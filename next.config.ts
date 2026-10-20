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
  experimental: {
    serverActions: {
      // Workshop registrants send in a photograph of their bank transfer, and
      // a photo off a phone is routinely 2-5 MB. The default cap is 1 MB,
      // which rejects most of them before any of our code runs — with a
      // server error rather than anything a person could act on.
      //
      // 10mb against the 8 MB the upload itself allows, because the limit
      // counts the whole multipart body, not just the file.
      bodySizeLimit: "10mb",
    },
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
