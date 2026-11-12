import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/sim/dy-cb", destination: "/sim/dy-cb.html" },
      { source: "/sim/seobu", destination: "/sim/seobu.html" },
      { source: "/gwplan", destination: "/gwplan/index.html" },
      { source: "/gwprofile", destination: "/gwprofile/index.html" },
    ];
  },
};

export default nextConfig;
