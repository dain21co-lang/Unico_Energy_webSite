import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/oksu", destination: "/oksu/index.html" }];
  },
};

export default nextConfig;
