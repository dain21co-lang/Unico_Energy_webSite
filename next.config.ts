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
      { source: "/sinchon/play", destination: "/sinchon/play/index.html" },
      { source: "/sinchon/play/en", destination: "/sinchon/play/en/index.html" },
      { source: "/dc7g2k9a", destination: "/dc7g2k9a/index.html" },
      { source: "/dc7g2k9a/roadmap", destination: "/dc7g2k9a/roadmap/index.html" },
      { source: "/2f3xu9ud", destination: "/2f3xu9ud/index.html" },
      { source: "/kdvsxfzd", destination: "/kdvsxfzd/index.html" },
      { source: "/pq7f5b79", destination: "/pq7f5b79/index.html" },
      { source: "/gasan/m4r9", destination: "/gasan/m4r9/index.html" },
      { source: "/seobu/m", destination: "/seobu/m/index.html" },
    ];
  },
};

export default nextConfig;
