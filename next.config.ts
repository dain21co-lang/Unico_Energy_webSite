import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/sim/dy-cb", destination: "/sim/dy-cb.html" },
      { source: "/sim/seobu", destination: "/sim/seobu.html" },
      { source: "/p5c9h2mj", destination: "/p5c9h2mj/index.html" },
      { source: "/f6b1y4ds", destination: "/f6b1y4ds/index.html" },
      { source: "/scprofile", destination: "/scprofile/index.html" },
      { source: "/scplan", destination: "/scplan/index.html" },
    ];
  },
};

export default nextConfig;
