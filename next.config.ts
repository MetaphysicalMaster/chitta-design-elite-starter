import type { NextConfig } from "next";

// Default config is unchanged for normal dev/build.
// When DEPLOY_EXPORT=1, produce a static export for GitHub Pages with a
// per-repo basePath (DEPLOY_BASEPATH, e.g. "/blue-sky-rebrand"). This lets each
// client mockup ship as its own GitHub Pages repo, mirroring the Pure Silk flow.
const isExport = process.env.DEPLOY_EXPORT === "1";
const basePath = process.env.DEPLOY_BASEPATH || "";

const nextConfig: NextConfig = isExport
  ? {
      output: "export",
      trailingSlash: true,
      basePath,
      assetPrefix: basePath || undefined,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
