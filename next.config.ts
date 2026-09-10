import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/role-intelligence" : undefined,
  assetPrefix: isGitHubPages ? "/role-intelligence" : undefined,
  trailingSlash: isGitHubPages,
  images: {
    // All product imagery is local and already web-optimized. Serving it
    // directly keeps previews, GitHub Pages, and Sites on the same path.
    unoptimized: true,
  },
};

export default nextConfig;
