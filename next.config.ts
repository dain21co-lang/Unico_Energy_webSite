import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/sim/dy-cb", destination: "/sim/dy-cb.html" }];
  },
};

export default nextConfig;
