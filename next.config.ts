import type { NextConfig } from "next";

// Imported Xiumi articles are addressed by their user-created slug, so the
// Cloudflare worker must serve dynamic reading routes instead of pre-rendering
// a fixed list at build time.
const nextConfig: NextConfig = {};

export default nextConfig;
