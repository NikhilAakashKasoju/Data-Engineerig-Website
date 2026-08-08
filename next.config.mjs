/**
 * Single source of truth for the deploy sub-path.
 *
 * Set to "" for a domain root or subdomain deploy.
 * Set to "/folder" (leading slash, no trailing slash) for a subfolder deploy —
 * it must match the folder name in public_html exactly.
 */
const basePath = "/azure";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Builds the whole site to ./out as plain HTML, CSS and JS — no Node runtime
   * required. This is what lets it sit on Hostinger's PHP shared hosting
   * alongside the existing site.
   *
   * Constraint: route handlers (app/api/**) are excluded from the export, so
   * anything server-side has to live elsewhere — hence the PHP endpoint.
   */
  output: "export",

  /**
   * Image optimization is a server feature and there is no server here, so
   * next/image serves the original files as-is.
   */
  images: { unoptimized: true },

  /**
   * Apache and LiteSpeed resolve /foo/ to /foo/index.html.
   */
  trailingSlash: true,

  basePath,

  /**
   * Exposed to the client because basePath is applied automatically to Next's
   * own assets (_next/*) but NOT to files in public/ referenced by next/image —
   * those srcs are passed through verbatim. Components prefix them with this,
   * so the path is still defined in exactly one place.
   */
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
