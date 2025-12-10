import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/overview",
        permanent: true,
      },
    ];
  },

  images: {
    domains: ["file360-dev.digitvant.com"],
  },
};

export default nextConfig;
