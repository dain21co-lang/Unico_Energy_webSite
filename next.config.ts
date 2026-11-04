import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/sim/dy-cb", destination: "/sim/dy-cb.html" },
      { source: "/sim/seobu", destination: "/sim/seobu.html" },
    ];
  },
};

export default nextConfig;
